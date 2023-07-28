import React, { FC, useState, useMemo } from 'react'
import { StyleSheet, Slider, ActivityIndicator } from 'react-native'
import * as FileSystem from 'expo-file-system'
import { Button } from 'react-native-elements'
import { LatLng, Region } from 'react-native-maps'
import { Card, IconButton, View, Text, Toast, Icon } from 'native-base';
import { showAlert, showXmas } from '../../../features/utils/Logger';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import MapUtils from '../../../features/utils/MapUtils'
import { TouchableOpacity } from 'react-native-gesture-handler'

type Props = {
    mapRegion: LatLng
    zoomLevel: number
    onLongPress: VoidFunction
}

export const AppConstants = {
    TILE_FOLDER: `${FileSystem.documentDirectory}tiles`,
    MAP_URL: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile',
}

const DownloadTilesButton: FC<Props> = ({ mapRegion, zoomLevel, onLongPress }) => {

    const [numZoomLevels, setZoomLevels] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const currentZoom = useMemo(() => {
        return ( Math.round(zoomLevel) );
    }, [mapRegion])

    async function fetchTiles() {
        setIsLoading(true)

        let zoom = (currentZoom > 17) ? 17 : currentZoom;
        const minZoom = zoom - 2
        const maxZoom = zoom + 1

        const tiles = MapUtils.tileGridForRegion(mapRegion, minZoom, maxZoom)

        // Create directory for tiles
        // TODO: Batch to speed up
        for (const tile of tiles) {
            const folder = `${AppConstants.TILE_FOLDER}/${tile.z}/${tile.x}/`
            await FileSystem.makeDirectoryAsync(folder, { intermediates: true })
        }

        // Download tiles in batches to avoid excessive promises in flight
        const BATCH_SIZE = 100

        let batch = []

        for (const tile of tiles) {

            const fetchUrl = `${AppConstants.MAP_URL}/${tile.z}/${tile.y}/${tile.x}`
            const localLocation = `${AppConstants.TILE_FOLDER}/${tile.z}/${tile.x}/${tile.y}.jpg`
            const tilePromise = FileSystem.downloadAsync(fetchUrl, localLocation)
            batch.push(tilePromise)

            if (batch.length >= BATCH_SIZE) {
                Promise.all(batch).catch((error) => { showXmas('ERROR', error) })
                    .then(() => {
                        batch = [];
                        //showAlert('DOWNLOAD STATE!', 'BATCH FINISHED!')
                    })
            }
        }

        await Promise.all(batch)
        alert('Finalizó la descarga del mapa, está viendo la versión offline.')

        setIsLoading(false)
    }

    const saveButton = (title: string, onPress: VoidFunction): JSX.Element => {
        return (
            <View flexDir={'row'} rounded={'full'} style={{ bottom: 240, left: 0, alignItems: 'center', position: 'absolute', justifyContent: 'center', backgroundColor: '#ffffff', alignSelf: 'flex-start', margin: 10, marginRight: 5, padding: 10,height:60,width:60 }}>
                <TouchableOpacity onPress={onPress} activeOpacity={0.5} onLongPress={() => {
                    FileSystem.deleteAsync(AppConstants.TILE_FOLDER);
                    Toast.show({ description: 'Deleted succesfully.' });
                    onLongPress();
                }}>
                    <ActivityIndicator animating={isLoading} size='large' style={{ bottom: -2, left: -2, position: 'absolute' }} color="coolGray.600" />
                    <Icon as={FontAwesome5} size={8} name={isLoading ? undefined : 'download'} color='coolGray.600' />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <>
            {saveButton("", fetchTiles)}
        </>
    )
}



function calcZoom(longitudeDelta: number) {
    return Math.round(Math.log(360 / longitudeDelta) / Math.LN2)
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
    },
    warningMessage: {
        marginVertical: 10,
        color: '#bbb',
        fontStyle: 'italic',
        fontSize: 10,
        textAlign: 'center',
    },
    estimate: {
        marginVertical: 15,
        textAlign: 'center',
    },
})

export default DownloadTilesButton;
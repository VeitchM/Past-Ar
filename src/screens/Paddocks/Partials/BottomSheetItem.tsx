import React, { useEffect, useState } from "react";
import { HStack, Heading, Icon, View } from "native-base";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from "react-native";
import fontColorContrast from 'font-color-contrast'
interface ItemProps {
    title: string,
    index: number,
    points?: [],
    backgroundColor?: string
    foreColor?: string
    color?: string
    enabled?: boolean
    canBeEdited?: boolean,
    onLocatePress: VoidFunction
    onEditPress?: VoidFunction
}

export default function BottomSheetItem({ title, points, index, backgroundColor, foreColor, color, enabled, canBeEdited, onLocatePress: onLocatePress, onEditPress: onEditPress }: ItemProps) {

    //-------CONST & HOOKS---------//
    const [iColor, setIColor] = useState("#DFFF00");
    const [iForeColor, setIForeColor] = useState("coolGray.100")
    const [iBackgroundColor, setIBackgroundColor] = useState("coolGray.200")

    useEffect(() => {
        if (color != undefined) setIColor(color);
        if (backgroundColor != undefined) setIBackgroundColor(backgroundColor);
        if (foreColor != undefined) setIForeColor(foreColor);
        if (enabled == undefined) enabled = true;
        let contrast = fontColorContrast(color!.toString());
        //setIForeColor(contrast);
    }, [color])

    //----------JSX-----------//
    return (
        <>
            <HStack backgroundColor={iColor + 'EE'} borderColor={iForeColor} style={{ ...styles.item }}>
                <Heading paddingBottom={2} mt="1" color={iForeColor} fontWeight="medium" size='md' maxWidth={'60%'} lineBreakMode='clip'>{title}</Heading>
                <View style={{ flex: 1 }}></View>

                {
                    canBeEdited ?
                        <TouchableOpacity onPress={() => { if (onEditPress != undefined) onEditPress() }}>
                            <Icon style={styles.icon} as={MaterialCommunityIcons} size={9} name={'pencil'} color={iForeColor} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => {}}>
                            <Icon style={styles.icon} as={MaterialCommunityIcons} size={9} name={'cloud-download'} color={iForeColor} />
                        </TouchableOpacity>
                }

                <TouchableOpacity onPress={() => { onLocatePress() }}>
                    <Icon style={styles.icon} as={MaterialCommunityIcons} size={10} name={'crosshairs-gps'} color={iForeColor} />
                </TouchableOpacity>

            </HStack>
        </>
    )

}
let styles = StyleSheet.create({
    icon: {
        margin: 5
    },
    border_icon: {
        borderWidth: 4, borderColor: '#ffffff', borderRadius: 100, margin: 5
    },
    item: {
        alignItems: 'center', borderWidth: 2, borderRadius: 6, width: '90%', minHeight: 60, margin: 8, paddingLeft: 20, paddingRight: 5
    }
})
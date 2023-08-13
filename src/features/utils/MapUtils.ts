import { LatLng, Region } from 'react-native-maps'

export type Tile = {
    x: number
    y: number
    z: number
}

export default class MapUtils {
    constructor() {
        return this;
    }

    static tileGridForRegion(
        region: LatLng,
        minZoom: number,
        maxZoom: number
    ): Tile[] {
        let tiles: Tile[] = []

        for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
            const subTiles = MapUtils.tilesForZoom(region, zoom)
            tiles = [...tiles, ...subTiles]
        }

        return tiles
    }

    private static degToRad(deg: number): number {
        return (deg * Math.PI) / 180
    }
    private static lonToTileX(lon: number, zoom: number): number {
        return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom))
    }

    private static latToTileY(lat: number, zoom: number): number {
        return Math.floor(
            ((1 -
                Math.log(Math.tan(MapUtils.degToRad(lat)) + 1 / Math.cos(MapUtils.degToRad(lat))) / Math.PI) /
                2) *
            Math.pow(2, zoom)
        )
    }

    private static tilesForZoom(region: LatLng, zoom: number): Tile[] {
        const distanceDelta = Math.exp(Math.log(360) - (zoom * Math.LN2));
        const minLon = region.longitude - distanceDelta
        const minLat = region.latitude - distanceDelta
        const maxLon = region.longitude + distanceDelta
        const maxLat = region.latitude + distanceDelta

        let minTileX = MapUtils.lonToTileX(minLon, zoom)
        let maxTileX = MapUtils.lonToTileX(maxLon, zoom)
        let minTileY = MapUtils.latToTileY(maxLat, zoom)
        let maxTileY = MapUtils.latToTileY(minLat, zoom)

        let tiles: Tile[] = []

        for (let x = minTileX; x <= maxTileX; x++) {
            for (let y = minTileY; y <= maxTileY; y++) {
                tiles.push({ x, y, z: zoom })
            }
        }

        return tiles
    }

    
}


import MapView, {
    LatLng,
    Marker,
    PROVIDER_GOOGLE,
    Polygon,
    Polyline,
    UrlTile,
} from "react-native-maps";
import { Position } from "geojson";
import { Paddock } from "../../features/store/types";
import * as turf from "@turf/turf";

const pointsExistInPoly = (
    points: LatLng[],
    polygons: Paddock[],
    excludeId: number
) => {
    let _points = turf.points(latLngToPositions(points));
    return polygons
        .filter((paddock, index) => index !== excludeId)
        .some(({ vertices }) => {
            const aux = turf.pointsWithinPolygon(_points, latLngToPoly(vertices));
            return aux.features.length;
        });
};

const getPointsInsidePoly = (
    points: LatLng[],
    vertices: LatLng[]
) => {
    let _points = turf.points(latLngToPositions(points));
    let result = turf.pointsWithinPolygon(_points, latLngToPoly(vertices));
    return positionsToLatLng(result.features.map(r => { return r.geometry.coordinates }));
};

const latLngToPositions = (vertices: LatLng[]): GeoJSON.Position[] => {
    return vertices.length > 0
        ? vertices.map((vertex) => {
            return [vertex.longitude, vertex.latitude];
        })
        : [];
};
const positionsToLatLng = (positions: GeoJSON.Position[]): LatLng[] => {
    return positions.length <= 0 ? [] :
        positions.map((pos) => {
            return { latitude: pos[1], longitude: pos[0] };
        });
};
const buildPolygonShape = (vertices: LatLng[]): GeoJSON.Geometry => {
    return {
        type: "Polygon",
        coordinates: [latLngToPositions(vertices)],
    };
};

const latLngToPoly = (polygon: LatLng[]) => {
    let pos: Position[] = latLngToPositions(polygon);
    if (pos[0] != pos[pos.length - 1]) pos = [...pos, pos[0]];
    return turf.polygon([pos]);
};

export default { getPointsInsidePoly, pointsExistInPoly, latLngToPositions, positionsToLatLng, buildPolygonShape, latLngToPoly }
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import MapView, {
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Polygon,
  Polyline,
  UrlTile,
} from "react-native-maps";
import { VStack, Heading, View, IconButton, Icon, Toast } from "native-base";
import { useEffect, useMemo, useRef, useState } from "react";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import {
  useTypedDispatch,
  useTypedSelector,
} from "../../features/store/storeHooks";
import { TouchableOpacity } from "react-native-gesture-handler";
import { addNotification } from "../../features/store/notificationSlice";
import { StackParamList } from "./ScreenStack";
import { updatePaddock } from "../../features/store/paddockSlice";
import { CommonActions } from "@react-navigation/native";
import { getLocation } from "../../features/location/location";
import { Position } from "geojson";
import { Paddock } from "../../features/store/types";
import * as turf from "@turf/turf";
import * as FileSystem from "expo-file-system";
import { TouchableHighlight } from "react-native";
import { getPaddocks } from "../../features/localDB/paddocks";
import MapBoxGL, { getAnnotationsLayerID } from "@rnmapbox/maps";
import { pushNotification } from "../../features/pushNotification";

type Props = NativeStackScreenProps<StackParamList, "EditScreen">;

const AppConstants = {
  TILE_FOLDER: `${FileSystem.documentDirectory}/tiles`,
  MAP_URL:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile",
};

export default function EditScreen(props: Props) {
  //-------CONST & HOOKS---------//
  const { route, navigation } = props;
  const { coordinates, paddockId, pointId, onCoordsChanged } = route.params;
  const [polygonVertices, setPolygonVertices] = useState<LatLng[]>([]);
  const [currentPointId, setCurretPointId] = useState(pointId);
  const [currentCoords, setCurrentCoords] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 0, longitude: 0 });
  const [actionStack, setActionStack] = useState<LatLng[]>([]);
  const [addingMode, isAddingMode] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const paddockList = useTypedSelector((state) => state.paddock.paddocks);
  const [paddocks, setPaddocks] = useState<Paddock[]>([]);
  const mapRef = useRef<MapBoxGL.Camera>(null);
  const dispatch = useTypedDispatch();

  const urlTemplate = useMemo(
    () =>
      isOffline
        ? `${AppConstants.TILE_FOLDER}/{z}/{x}/{y}.jpg`
        : `${AppConstants.MAP_URL}/{z}/{y}/{x}`,
    []
  );

  //---------FUNCTIONS----------//
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTintColor: "white",
      headerStyle: {
        backgroundColor: "#3498db77",
      },
      headerTitleStyle: { fontFamily: "" },
      headerLeft: backButton,
    });
    initializePaddockList();
    changeRegion(coordinates.latitude, coordinates.longitude);
    setCurrentCoords({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
  }, []);

  function initializePaddockList() {
    getPaddocks().then((result) => {
      let _paddocks = [...paddocks];
      result.forEach((value) => {
        let vertices: LatLng[] = JSON.parse(value.vertices_list!);
        let paddockData: Paddock = {
          ID: value.ID,
          name: value.name,
          vertices: vertices,
        };
        if (
          vertices.length > 0 &&
          !paddocks.some((p) => {
            return p.ID == value.ID;
          }) &&
          paddockList[paddockId].ID != value.ID
        )
          _paddocks = [..._paddocks, paddockData];
      });
      setPaddocks(_paddocks);
    });
  }

  function LocationButton() {
    return (
      <View
        flexDir={"row"}
        rounded={"full"}
        style={{
          bottom: 90,
          left: 0,
          alignItems: "center",
          position: "absolute",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          borderWidth: 0,
          borderColor: "#ffffffB5",
          alignSelf: "flex-start",
          margin: 10,
          marginRight: 5,
          padding: 10,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={fetchLocation}
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Icon
            as={FontAwesome5}
            size={10}
            name={"compass"}
            color="coolGray.600"
          />
        </TouchableOpacity>
      </View>
    );
  }

  function InfoButton() {
    return (
      <View
        flexDir={"row"}
        rounded={"full"}
        style={{
          bottom: 20,
          left: 0,
          alignItems: "center",
          position: "absolute",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          borderWidth: 0,
          borderColor: "#ffffffB5",
          alignSelf: "flex-start",
          margin: 10,
          marginRight: 5,
          padding: 10,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            setOpenInfo(!openInfo);
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Icon
            as={FontAwesome5}
            size={10}
            name={"info-circle"}
            color="coolGray.600"
          />
          {!openInfo ? (
            <></>
          ) : (
            <Heading
              size={"sm"}
              color={"#34495e"}
              marginLeft={1}
              marginRight={1}
            >
              {addingMode
                ? "Press map to add vertices"
                : `lat: ${currentCoords.latitude + "\n"}lng: ${
                    currentCoords.longitude
                  }`}
            </Heading>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  const fetchLocation = () => {
    getLocation()
      .then((value) => {
        if (value) changeRegion(value.coords.latitude, value.coords.longitude);
      })
      .catch((error) => {
        fetchLocation();
      });
  };

  function changeRegion(lat: number, lng: number) {
    const latitude = lat;
    const longitude = lng;
    mapRef.current?.setCamera({
      zoomLevel: 12,
      centerCoordinate: [lng, lat],
      animationMode: "flyTo",
      animationDuration: 1500,
    });
  }

  const polygonHasKinks = (polygon: LatLng[]) => {
    let _polygon = latLngToPoly(polygon);
    let _kinks = turf.kinks(_polygon).features;
    return _kinks.length > 0;
  };

  const polygonOverlaps = (polygon: LatLng[], selectedPaddockUid?: number) => {
    let _polygon = latLngToPoly(polygon);
    return paddocks
      .filter(
        (paddock, index) =>
          index !== selectedPaddockUid && paddock.vertices.length > 0
      )
      .some(({ vertices }) => {
        const aux = turf.intersect(_polygon, latLngToPoly(vertices));
        return !!aux;
      });
  };

  const pointsIntersect = (points: LatLng[], selectedPaddockUid?: number) => {
    let _points = turf.lineString(
      points.map((e) => {
        return [e.latitude, e.longitude];
      })
    );
    return paddocks
      .filter(
        (paddock, index) =>
          index !== selectedPaddockUid && paddock.vertices.length > 0
      )
      .some(({ vertices }) => {
        const aux = turf.lineIntersect(_points, latLngToPoly(vertices));
        return aux.features.length > 0;
      });
  };
  /**
   * Generates a new polygon adding a vertex to an existing polygon in a way the new polygon doesn't have kinks.
   * @param polygon Base polygon.
   * @param point Point to be added to the base polygon.
   * @returns If was possible to generate a polygon without kinks returns the new polygon and its index, otherwise returns undefined.
   */
  const getPolygonWithPoint = (polygon: LatLng[], point: LatLng) => {
    let _point = turf.point([point.latitude, point.longitude]);
    let _points = turf.featureCollection(
      polygon.map((v) => {
        return turf.point([v.latitude, v.longitude]);
      })
    );
    let minDistance = 99999;
    let minIndex = -1;
    _points.features.forEach((p, i) => {
      let adjacentIndex = i == _points.features.length - 1 ? 0 : i + 1;
      let dis = turf.distance(
        _point,
        turf.midpoint(p, _points.features[adjacentIndex])
      );
      if (dis < minDistance) {
        minDistance = dis;
        minIndex = i;
      }
    });
    let newPoly;
    // If the new point is to be added after the last point, it is added simply at the end of the array
    if (minIndex == polygon.length - 1 || polygon.length <= 2) {
      newPoly = [...polygon, point];
      minIndex = polygon.length;
    }
    // Otherwise it is added in between the closest vertices
    else {
      newPoly = [
        ...polygon.slice(0, minIndex + 1),
        { latitude: point.latitude, longitude: point.longitude },
        ...polygon.slice(minIndex + 1),
      ];
      minIndex++;
    }
    return !polygonHasKinks(newPoly)
      ? { poly: newPoly, index: minIndex }
      : undefined;
  };

  /**
   * @param excludeId An id to be excluded on the polygon search, usually the active paddock id.
   * @returns True if some of the points provided is inside the polygon, false if not.
   */
  const pointsInsidePolygon = (
    points: LatLng[],
    polygons: Paddock[],
    excludeId: number
  ) => {
    let _points = turf.points(
      points.map((v) => {
        return [v.latitude, v.longitude];
      })
    );
    return polygons
      .filter((paddock, index) => index !== excludeId)
      .some(({ vertices }) => {
        const aux = turf.pointsWithinPolygon(_points, latLngToPoly(vertices));
        return aux.features.length;
      });
  };

  const verticesToPositions = (vertices: LatLng[]): GeoJSON.Position[] => {
    return vertices.length > 0
      ? vertices.map((vertex) => {
          return [vertex.longitude, vertex.latitude];
        })
      : [];
  };

  const buildPolygonShape = (vertices: LatLng[]): GeoJSON.Geometry => {
    return {
      type: "Polygon",
      coordinates: [verticesToPositions(vertices)],
    };
  };

  /**
   * Transforms a LatLng array into a Turf Polygon object
   */
  const latLngToPoly = (polygon: LatLng[]) => {
    let pos: Position[] = polygon.map((value) => {
      return [value.latitude, value.longitude];
    });
    if (pos[0] != pos[pos.length - 1]) pos = [...pos, pos[0]];
    return turf.polygon([pos]);
  };

  //--------JSX-XTRA-COMPONENTS---------//

  const backButton = () => {
    return (
      <TouchableHighlight
        style={{ borderRadius: 120, marginRight: 5 }}
        underlayColor={"#99a3a455"}
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate({
              name: "CreatePaddock",
              params: {
                paddockId: paddockId,
                create: false,
              },
            })
          );
        }}
      >
        <View
          borderRadius={120}
          height={50}
          width={50}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Icon as={FontAwesome5} color={"#fff"} name="arrow-left" size="sm" />
        </View>
      </TouchableHighlight>
    );
  };

  /**
   * Renders all the polygons excluding the current one.
   */
  function OtherPolygons() {
    console.log(paddocks);
    return (
      <>
        {paddocks
          .filter((p, i) => {
            return i != paddockId && p.vertices.length > 0;
          })
          .map((paddock, index) => {
            return (
              <MapBoxGL.ShapeSource
                key={"POLYSHAPE_" + index + paddocks.length}
                id={"POLYSHAPE_" + index}
                shape={buildPolygonShape([
                  ...paddock.vertices,
                  paddock.vertices[0],
                ])}
              >
                <MapBoxGL.FillLayer
                  maxZoomLevel={100000}
                  sourceID={"POLYSHAPE_" + index}
                  id={"POLYFILL_" + index}
                  style={{
                    fillColor: colors[index] + "BB",
                    fillOpacity: 0.8,
                    fillOutlineColor: "#ffffff",
                  }}
                />
                <MapBoxGL.LineLayer
                  maxZoomLevel={100000}
                  sourceID={"POLYSHAPE_" + index}
                  id={"POLYLINE_" + index}
                  style={{ lineColor: colors[index] }}
                />
              </MapBoxGL.ShapeSource>
            );
          })}
      </>
    );
  }

  /**
   * Renders Markers for each vertex of the current polygon.
   */
  function PinList() {
    return (
      <>
        {polygonVertices.map((point, index) => {
          return (
            <MapBoxGL.PointAnnotation
              key={"POINT_" + index}
              id={"POINT_" + index}
              coordinate={[point.longitude, point.latitude]}
              draggable
              onDragEnd={(e) => {
                let a = {
                  latitude: e.geometry.coordinates[1],
                  longitude: e.geometry.coordinates[0],
                };
              }}
            >
              <></>
            </MapBoxGL.PointAnnotation>
          );
        })}
      </>
    );
  }

  /**
   * Renders the current polygon, has a fixed bg color and stroke color.
   */
  function CurrentPolygon() {
    return (
      <>
        {polygonVertices.length > 0 ? (
          <MapBoxGL.ShapeSource
            key={"POLYSHAPE"}
            id={"POLYSHAPE"}
            shape={buildPolygonShape([...polygonVertices, polygonVertices[0]])}
          >
            <MapBoxGL.FillLayer
              maxZoomLevel={100000}
              sourceID={"POLYSHAPE"}
              id={"POLYFILL"}
              style={{
                fillColor: "#a93226BB",
                fillOpacity: 0.8,
                fillOutlineColor: "#ffffff",
              }}
            />
            <MapBoxGL.LineLayer
              maxZoomLevel={100000}
              sourceID={"POLYSHAPE"}
              id={"POLYLINE"}
              style={{ lineColor: "#a93226" }}
            />
          </MapBoxGL.ShapeSource>
        ) : (
          <></>
        )}
      </>
    );
  }

  /**
   * Renders a line that helps visualize the polygon lines in adding mode.
   * Soon to be deprecated.
   */
  function PolyLine() {
    return (
      <>
        {addingMode && polygonVertices.length > 1 ? (
          <Polyline
            coordinates={[
              polygonVertices[0],
              polygonVertices[polygonVertices.length - 1],
            ]}
            strokeColor={"#fd7e14"}
            lineDashPattern={[20, 20]}
            strokeWidth={5}
          />
        ) : (
          <></>
        )}
      </>
    );
  }

  /**
   * Runs a series of verifications to avoid colision between paddocks when inserting a new vertex. If all verifications are passed succesfully the vertex is added.
   * @param newCoords New vertex coordinates.
   * @param pinId Paddock id in case is called for an update of coordinates value (Marker Drag)
   */
  function updatePin(newCoords: LatLng, pinId?: number) {
    let _vertices = [...polygonVertices];
    if (pinId !== undefined) _vertices[pinId] = newCoords;

    let error = undefined;
    let poly = undefined;
    let index = -1;
    // Before all things checks if the new vertex is being added inside an existing polygon.
    if (pointsInsidePolygon([..._vertices, newCoords], paddocks, paddockId)) {
      error = "Error, ya existe potrero en ese punto";
    } else {
      // Vertifications for polygonVertices.length 0 and 1, first is simply added, second runs a linear vertification.
      if (_vertices.length <= 1) {
        if (_vertices.length == 0) poly = [newCoords];
        else {
          if (pointsIntersect([..._vertices, newCoords], paddockId))
            error = "Error, colisión de potreros";
          else {
            index = _vertices.length;
            poly = [..._vertices, newCoords];
          }
        }
      }
      // Verifications for polygonVertices.length > 1
      else {
        //Check if the new polygon will have crossed sides
        let res = getPolygonWithPoint(polygonVertices, newCoords);
        poly = res?.poly;
        index = res?.index || -1;
        if (!poly) {
          error = "Error, no se puede ubicar este punto.";
        } else {
          //Check if the new polygon will overlap existing polygons
          if (polygonOverlaps([..._vertices, newCoords], paddockId))
            error = "Error, colisión de potreros";
        }
      }
    }
    if (!error && !!poly) {
      setCurretPointId(_vertices.length);
      setCurrentCoords(newCoords);
      setActionStack([...actionStack, newCoords]);
      setPolygonVertices(poly);
    } else Toast.show({ description: error, bottom: 10 });
  }

  /**
   * Renders the floating Dock containing the Add, Save and Undo buttons.
   */
  function ButtonDock() {
    return (
      <View key={"dock"} position={"absolute"} bottom={5} right={3}>
        <View
          key={"dock0"}
          style={{ backgroundColor: "#fff" }}
          padding={2}
          rounded={"full"}
        >
          {!addingMode ? (
            <></>
          ) : (
            <IconButton
              key={"dock1"}
              backgroundColor={
                addingMode && actionStack.length > 0 ? "#b03a2e" : "#566573"
              }
              borderColor={
                addingMode && actionStack.length > 0 ? "#b03a2e88" : "#56657388"
              }
              borderWidth={3}
              rounded="full"
              variant="solid"
              _icon={{
                as: FontAwesome5,
                size: "3xl",
                name: addingMode && actionStack.length > 0 ? "undo" : "ban",
              }}
              style={{ marginBottom: 10, width: 70, height: 70 }}
              onPress={() => {
                if (addingMode && actionStack.length > 0) {
                  let tmpStack = [...actionStack];
                  let lastAction = tmpStack.pop();
                  let vertices = polygonVertices.filter((v, i) => {
                    return (
                      v.latitude != lastAction?.latitude &&
                      v.longitude != lastAction?.longitude
                    );
                  });
                  if (actionStack.length == 1) {
                    setCurretPointId(0);
                    tmpStack = [];
                  } else {
                    setCurretPointId(polygonVertices.length - 2);
                    setCurrentCoords(vertices[vertices.length - 1]);
                  }
                  setActionStack(tmpStack);
                  setPolygonVertices(vertices);
                } else isAddingMode(false);
              }}
            ></IconButton>
          )}
          <IconButton
            key={"dock2"}
            backgroundColor={"#d86e5f"}
            borderColor={"#d86e5f55"}
            borderWidth={3}
            icon={
              !addingMode ? (
                <>
                  <Icon
                    key={"I1"}
                    as={FontAwesome5}
                    name="map-marker-alt"
                    color={"#fff"}
                    size={"2xl"}
                    position={"absolute"}
                    left={2}
                  ></Icon>
                  <Icon
                    key={"I2"}
                    as={FontAwesome5}
                    name={"plus"}
                    color={"#fff"}
                    size={"lg"}
                    position={"absolute"}
                    right={1.5}
                  ></Icon>
                </>
              ) : (
                <Icon
                  as={FontAwesome5}
                  name={"check"}
                  color={"#fff"}
                  size={"2xl"}
                ></Icon>
              )
            }
            rounded="full"
            variant="solid"
            style={{ width: 70, height: 70 }}
            onPress={() => {
              isAddingMode(!addingMode);
              setCurretPointId(-999);
              if (addingMode) {
                setActionStack([]);
              }
            }}
          ></IconButton>
          {addingMode ? (
            <></>
          ) : (
            <IconButton
              key={"dock3"}
              backgroundColor={"#f39c12"}
              borderColor={"#f39c1255"}
              borderWidth={3}
              _icon={{ as: Entypo, name: "save", size: "4xl" }}
              rounded="full"
              variant="solid"
              style={{ marginTop: 10, width: 70, height: 70 }}
              onPress={() => {
                if (polygonVertices.length >= 3) {
                  let data = {
                    ID: paddockList[paddockId].ID,
                    name: paddockList[paddockId].name,
                    vertices: polygonVertices,
                  };
                  dispatch(updatePaddock({ data: data, paddockId: paddockId }));
                  pushNotification("Vertice guardado correctamente.", "info");
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: "CreatePaddock",
                      params: {
                        paddockId: paddockId,
                        create: false,
                      },
                    })
                  );
                } else {
                  Toast.show({
                    description:
                      "Error, debe agregar más vertices antes de guardar (PMS2)",
                  });
                }
              }}
            ></IconButton>
          )}
        </View>
      </View>
    );
  }

  function onMapPressHandler(feature: any) {
    let geoCoords: number[] = feature.geometry.coordinates;
    let newCoords = {
      latitude: geoCoords[1],
      longitude: geoCoords[0],
    };
    if (addingMode) updatePin(newCoords);
  }

  //----------JSX-----------//

  return (
    <VStack bg="white" flex={1} alignItems="center">
      <MapBoxGL.MapView
        style={{ flex: 1, alignSelf: "stretch" }}
        logoEnabled={false}
        styleURL={undefined}
        onPress={onMapPressHandler}
        onMapIdle={(s) => {
          setCurrentCoords({
            latitude: s.properties.center[1],
            longitude: s.properties.center[0],
          });
        }}
      >
        <MapBoxGL.Camera ref={mapRef} />
        <MapBoxGL.UserLocation />
        {/* <PolyLine /> */}
        <OtherPolygons />
        <PinList />
        <CurrentPolygon />
      </MapBoxGL.MapView>

      <LocationButton />
      <InfoButton />
      <ButtonDock />
    </VStack>
  );
}

const colors = [
  "#ffbe0b",
  "#fb5607",
  "#ff006e",
  "#3a86ff",
  "#7FFF00",
  "#FFFF00",
  "#FF6347",
  "#00FFFF",
  "#FF00FF",
  "#FF1493",
  "#FF69B4",
  "#FF8C00",
  "#FFD700",
  "#00FF00",
  "#00CED1",
  "#FF4500",
  "#FF00FF",
  "#FF7F50",
  "#00BFFF",
  "#1E90FF",
  "#ADFF2F",
  "#FF6347",
  "#FF69B4",
  "#FF8C00",
  "#FFD700",
  "#00FF7F",
  "#00CED1",
];

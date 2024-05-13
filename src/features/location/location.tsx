import * as Location from "expo-location";

const config = {
  //For testing purposes DELETE AFTER
  accuracy: Location.LocationAccuracy.BestForNavigation,
  //   timeInterval: 0,
  timeout:6000
  //   distanceInterval: 0,
};

export async function getLocation() {
  try {
    Location.isBackgroundLocationAvailableAsync().then((result) =>
      console.log("Is background location available", result)
    );

    Location.requestForegroundPermissionsAsync().then((result) =>
      console.log("Foreground permission request", result)
    );

    Location.getLastKnownPositionAsync().then((position) => {
      console.log("Background Last known position", JSON.stringify(position));
    });
    Location.getCurrentPositionAsync(config).then((position) =>
      console.log("Background position", JSON.stringify(position))
    );
    const location = await Location.getCurrentPositionAsync();

    // Location.getBackgroundPermissionsAsync().then((value) => {
    //   console.log("Background Permissions", JSON.stringify(value));
    // });
    console.log("Get location:", location);
    return location;
  } catch (e) {
    return undefined;
  }
}
// -38.0098303 -57.5501679  1715384712865

import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "background-location-task";

Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME).then((status) =>
  console.log("Location updates were already started", LOCATION_TASK_NAME)
);

Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, config);
console.log(
  "Was location already defined",
  TaskManager.isTaskDefined(LOCATION_TASK_NAME)
);
TaskManager.isTaskDefined(LOCATION_TASK_NAME);
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.error(error);
    return;
  }
  if (data) {
    console.log("Data on background task", data);
    // do something with the locations captured in the background
  }
});

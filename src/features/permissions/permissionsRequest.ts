import { PermissionsAndroid, Platform } from "react-native";
import * as ExpoDevice from "expo-device";


// import { OpenOptimizationSettings, BatteryOptEnabled } from "react-native-battery-optimization-check";


//---------------------------Permissions--------------------------------------------------------------------------------

/**It has also notifications in general, it is not anymao only BLEa */
const requestAndroid31Permissions = async () => {
  console.log("Requested API 31 permissions");
  try {

    const bluetoothPermissions = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      // PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      // PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE,
      // PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      // PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
      // PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE,

    ]);
    console.log("BluetoothPermissions",bluetoothPermissions);

    return Object.values(bluetoothPermissions).every(
      (value) => value === "granted"
    );
  } catch (error) {
    console.error("Error on request permissions");
    return false;
  }
};

const requestPermissions = async () => {
  if (Platform.OS === "android") {
    console.log("Platform API level", ExpoDevice.platformApiLevel);

    if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "Bluetooth Low Energy requires Location",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const isAndroid31PermissionsGranted = await requestAndroid31Permissions();

      return isAndroid31PermissionsGranted;
    }
  } else {
    console.log("It is not android");

    return true;
  }
};

export default requestPermissions;

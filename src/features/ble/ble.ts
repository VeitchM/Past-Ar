/* eslint-disable no-bitwise */

/** Its value its used for filtering devices will scanning */
import { hardware as PASTUROMETER_PROPERTIES } from '../../../config.json'

const RECONNECTIONS_INTENTS = 4
const TIME_BETWEEN_RECONNECTIONS = 1000
const MTU = 255

// Important: When using expo, when you refresh all the variable are setted to their original states, 
//but it doesnt reset the already made connections, so they will stay in a unreacheable space(Or i think so)
// So previusly restart expo you should disconnect the device, for now this is archive going back.


import requestPermissions from "./blePermissionRequest";

import { BleErrorCode, BleManager, Device, Subscription } from "react-native-ble-plx";

import { setConnectedDevice, addDevice, resetDevices, setTryingToConnect, setDisconnected } from "../store/bleSlice";

import store from "../store/store";

import bleConstants from "./bleConstants";

import { DeviceSerializable } from "../store/types";






const bleManager = new BleManager()
requestPermissions()



//
console.log('Ble imported');


bleManager.onStateChange((state) => {
  console.log('Bluetooth ', state);
  //
}, true)

let onAnomalousDisconnectionSubscription: Subscription = {
  remove: () => { console.error('Empty onAnomalousDisconnectionSubcription called') }
}

// Crappy name, needs to change, for some reason onDeviceDisconnected its called more than one time, 6 seconds aprox, I think it needs to be selfunsubscribed in its own callback
const onAnomalousDisconnection = (deviceId: string) => {
  console.log('On anomalous disconnection was called');

  onAnomalousDisconnectionSubscription = bleManager.onDeviceDisconnected(deviceId, (error, device) => {

    // Consoles ==============================
    error && console.error(error)
    console.error('On device disconnected onAnomalousDisconnection callback was called', Date.now());

    //self unsubscription
    onAnomalousDisconnectionSubscription.remove();

    // console.log('Error on anomalous disconnection ', error, !!device);
    // error means there was an anomalous disconnection, not using the disconnect method
    // docummentation lies, if i disconnect the device it also gives null error.

    const bleStore = store.getState().ble
    if (bleStore.connectionState != 'disconnected' && bleStore.connectedDevice) {
      store.dispatch(setTryingToConnect());
      console.info("DEVICE",device,bleStore);
      
      pushNotification('El Pasturometro se ha desconectado', 'error' )
      tryToReconnect({ id: bleStore.connectedDevice.id, name: bleStore.connectedDevice.name }, RECONNECTIONS_INTENTS);
    }

    //Else it was disconnected by the method disconnectToDevice()
  })
}


/** try to reconnects to device, if it fails it will set connected device to null*/
function tryToReconnect(device: DeviceMin, intentsLeft: number) {

  if (intentsLeft > 0)
    setTimeout(() => {
      connectToDevice(device).then((deviceConnected) => {

        console.log('Try to reconnect:  interNum: ', intentsLeft, ' success: ', !!deviceConnected)
        if (!deviceConnected)
          tryToReconnect(device, intentsLeft - 1)
        else {
          console.log('Reconnected');
          pushNotification('El Pasturometro ha restablecido la conexion','info' )
        }
      })


    }, TIME_BETWEEN_RECONNECTIONS);
  else {
    //It did all posible intents so it sets itself to disconnected
    store.dispatch(setDisconnected())
  }
}

/**
 * It will refresh redux with the available devices
 * 
 * @preconditions Bluetooth must be on, and permissions granted
 */
const scanForPeripherals = () => {
  try {

    console.log('Started Scanning');
    updatePersistedDevices()
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        //errorCallback.current(error);
        console.error('Error scaning peripherals', error)
        if (error.errorCode == BleErrorCode.BluetoothPoweredOff) {
          pushNotification('Encienda el bluetooth', 'error')
        }

      }
      else {

        //console.log('Found Device ',device?.name);
        if (device && device.name?.toUpperCase().includes(PASTUROMETER_PROPERTIES.DEVICE_BRAND.toUpperCase())) {
          // if (device) {
          // console.log('Scanned device');
          // console.log(device);


          store.dispatch(addDevice(getDeviceIfExists(device.id, device.name)))
        }
      }

      //}
    });

  }
  catch (error) {
    //errorCallback.current(e)
    console.error('Error scanning', error)

  }
}

/** Clean devices list and stop scanning, if it's not scanning it does nothing */
const stopScanningForPeripherals = () => {
  bleManager.stopDeviceScan();
  store.dispatch(resetDevices())
  console.log('stop scanning');

}

/**
 * Connects to a device, and refresh the app state to connected in Redux
 * 
 * @param device A device of type Device Serializable, 
 * the device should be provided by previously using scanForPeripherals, and just id will b used
 * p
 * @preconditions Bluetooth must be on, and permissions granted
 */
const connectToDevice = async (device: DeviceMin) => {
  let deviceConnection = null
  let deviceIsConnected = await bleManager.isDeviceConnected(device.id)
  console.log('ConnectionToDevice called');

  if (!deviceIsConnected) {

    try {
      deviceConnection = await bleManager.connectToDevice(device.id, { requestMTU: MTU });
      if (deviceConnection) {
        store.dispatch(setConnectedDevice(getDeviceIfExists(device.id, device.name)));
        await deviceConnection.discoverAllServicesAndCharacteristics();
        // It already stop scanning following the control flow of the screens, but it is an idempotent function so...
        stopScanningForPeripherals()
        setMonitorsCallbacks(deviceConnection);
        onAnomalousDisconnection(device.id)
        console.log('Connnected to device ', device.name);
      }
    }
    catch (error) {

      console.error('Error Connecting', error);
      store.dispatch(setDisconnected())

    }
  }

  return deviceConnection

};

/**Could be a reducer
* It disconect the current device
* If it is not connected, it does nothing 
*/
const disconnectFromDevice = async () => {

  const connectedDevice = store.getState().ble.connectedDevice

  let deviceIsConnected = connectedDevice && await bleManager.isDeviceConnected(connectedDevice.id)

  console.log('Try disconnect: ', connectedDevice, store.getState().ble.connectionState);


  store.dispatch(setDisconnected())

  if (deviceIsConnected) {
    if (connectedDevice)
      await bleManager.cancelDeviceConnection(connectedDevice.id)
    // Verify if the disconnection was succesful
    console.log('Disconnected from: ', connectedDevice);

  }



};


import { onCharacteristicUpdate } from "./characteristicHandlers";
import { addNotification } from "../store/notificationSlice";
import { pushNotification } from "../pushNotification";
import { getPersistedDevices } from "../localDB/device"
import { getDeviceIfExists, updatePersistedDevices } from "./persistedDevices"
import { DeviceMin } from "./type";
import { log } from 'react-native-reanimated';

/** Set callbacks in monitors for each characteristic, it is called by the connectToDevice function
*
* @precondition Must be connected
*/
const setMonitorsCallbacks = async (device: Device) => {
  const services = bleConstants.services
  if (device) {

    //must handle unsubscription on disconnect
    device.monitorCharacteristicForService(
      services.main.UUID,
      services.main.characteristics.main.UUID,
      onCharacteristicUpdate
    );


  } else {
    console.error("No Device Connected");
  }
};



// ttps://github.com/dotintent/react-native-ble-plx/wiki/Characteristic-Notifying
// Note:
// Android:
// Theoretically if the notification/indication is 20 bytes long the client is responsible to issue a characteristic read afterwards to read any data that could not fit into the limit.
//  Android does not perform the read by default

export default bleManager
export { scanForPeripherals, connectToDevice, disconnectFromDevice, stopScanningForPeripherals }



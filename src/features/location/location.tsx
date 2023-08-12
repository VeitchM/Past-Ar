import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';
//TODO why this codes destroys the app and is not handled by expo in any way

// const requestPermissions = async () => {
//     const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
//     if (foregroundStatus === 'granted') {
//       const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
//       if (backgroundStatus === 'granted') {
//         //TODO verify
//         await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//           accuracy: Location.Accuracy.Balanced,
//         });
//       }
//     }
//   };


// requestPermissions()

//TODO maybe it should set on Redux the permission granted

export async function getLocation() {
    try {
        const location = await Location.getCurrentPositionAsync()
        console.log('Get location:', location);
        return location
    }
    catch(e){
        return undefined;
    }
}
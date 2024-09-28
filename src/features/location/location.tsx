import { getCurrentPositionAsync, LocationAccuracy } from "expo-location";

export async function getLocation() {
  try {
    const location = await getCurrentPositionAsync({
      accuracy: LocationAccuracy.BestForNavigation,
    });
    return location;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

import { getCurrentPositionAsync } from "expo-location";

export async function getLocation() {
  try {
    const location = await getCurrentPositionAsync();
    return location;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

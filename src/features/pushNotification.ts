import { addNotification } from "./store/notificationSlice";
import store from "./store/store";
import { Notification } from "./store/types";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const soundAsset = require("../../assets/sound.mp3");

import { Audio } from "expo-av";

async function playSound() {
  const sound = (await Audio.Sound.createAsync(soundAsset)).sound;

  if (sound) {
    await sound.playAsync();
    sound.unloadAsync();
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

registerForPushNotificationsAsync();

export async function pushNotification(
  title: Notification["title"],
  status: Notification["status"],
  SONotification = true
) {
  store.dispatch(addNotification({ title, status }));
  if (SONotification)
    Notifications.scheduleNotificationAsync({
      content: {
        title,
      },
      trigger: null,
    });
  // playSound();
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    });
    // console.log(token);
  } else {
    console.error("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "sound.wav",
    });
  }

  return token;
}

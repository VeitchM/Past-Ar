import { onInit as onInitUser } from "../backend/onInit";
import { setLastMeasurement } from "../store/measurementSlice";
import store from "../store/store";
import { getLastMeasurement } from "./measurements";

export function onInit() {
  onInitUser();
  getLastMeasurement().then((row) => {
    if (row) {
      const { sendStatus, ID, ...measurement } = row;
      // console.log('Row last',row);
      // console.log('Row last',measurement);
      store.dispatch(setLastMeasurement(measurement));
    }
  });
}

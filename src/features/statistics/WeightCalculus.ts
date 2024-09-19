import { getCalibrations } from "../localDB/calibrations";

export async function calculateByHeight(height: number, calibrationID: number) {
  const cal = await getCalibrations();
  const [calibration] = cal.filter((e) => {
    return e.ID == calibrationID;
  });
  console.log(calibration.function);
  if (calibration && calibration.function) {
    console.log(
      processFunction(height, calibration.function.split(",").map(Number)),
    );
    return processFunction(height, calibration.function.split(",").map(Number));
  }
  return 0;
}

function processFunction(h: number, fun: number[]) {
  return Math.floor(fun[0] * h + fun[1]);
}

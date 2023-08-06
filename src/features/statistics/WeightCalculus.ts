import { getCalibrations } from "../localDB/localDB";
import { Measurement } from "../store/types";
import React from "react";


export default class WeightCalculus {

}

export async function calculateByHeight(height:number,calibrationID:number) {
    let cal = await getCalibrations();
    let filtered = cal.filter(e=>{return e.ID == calibrationID});
    if (filtered.length > 0 && filtered[0].function){
        return (processFunction(height, filtered[0].function!.split(',').map(_ => { return parseInt(_) })))
    }
    return 0;
}

function processFunction(h: number, fun: number[]) {
    let res = 0;
    fun.forEach((v,i)=>{
        if (i==0) res+=v;
        else{
            res+=v*Math.pow(h,i);
        }
    })
    return res;
}
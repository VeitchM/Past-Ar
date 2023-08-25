
export class AsyncReturn {}

const LONG = 5000; const MID = 3000; const SHORT = 1000;

function rejectAfter(time: number){
    return(new Promise<AsyncReturn>((resolve,reject)=>{ setTimeout(reject,time) }));
}

function resolveAfter(time: number){
    return(new Promise<AsyncReturn>((resolve,reject)=>{ setTimeout(resolve,time) }));
}

function doAfter(fn:VoidFunction, time:number){
    return(new Promise<AsyncReturn>((resolve,reject)=>{ setTimeout(fn,time) }));
}

export default {rejectAfter,resolveAfter,doAfter,LONG,MID,SHORT};
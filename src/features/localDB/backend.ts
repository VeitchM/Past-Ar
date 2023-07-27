import { execQuery } from "./localDB"
import { SendableTables } from "./types"


export enum SendStatus { NOT_SENT, SENT, SENDING, FOR_SENDING }



/** Set all rows which are marked as sending to SENT if success is true, and to NOT_SENT if it is false,   */
export async function setSending(success: boolean, table: SendableTables) {
    // const measurements = new Array<MeasurementForFront>()
    let sendStatus = success ? SendStatus.SENT : SendStatus.NOT_SENT
    const query = `UPDATE ${table} SET sendStatus = ${sendStatus} WHERE sendStatus = ${SendStatus.SENDING}`
    return execQuery(query)

}

export async function setSendStatus(sendStatus: SendStatus, table: SendableTables, rowID: number) {
    const query = `UPDATE ${table} SET sendStatus = ${sendStatus} WHERE ID = ${rowID}`
    return execQuery(query)

}


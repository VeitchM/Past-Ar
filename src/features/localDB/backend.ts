import { executeNativeBackPress } from "react-native-screens";
import { CalibrationForBack, MeasurementForBack } from "../backend/types";
import { Tokens, User } from "../store/backendSlice";
import { execQuery, execTransaction } from "./localDB";
import { tablesNames } from "./tablesDefinition";
import { calibrationsFromFunctionFromBackend } from "./types";


type UserTable = (Tokens & User & { signedIn: boolean, localId: number })


const columns: Array<keyof Omit<UserTable, 'localId'>> =
    [
        // 'localId',
        'refreshToken',
        'accessToken',
        'expirationTimestamp',
        'refreshExpirationTimestamp',
        'id',
        'firstName',
        'lastName',
        'email',
        'roles',
        'groupUid',
        'signedIn'
    ]

const placeHolder = new Array(columns.length + 1).fill('?').toString()
console.log('Placeholder', placeHolder);


export function persistUserData(userData: Omit<UserTable, 'localId'>) {

    const query = `INSERT OR REPLACE INTO user (localId,${columns.toString()}) values (${placeHolder})`
    const values = [0, ...columns.map((column) => column == 'roles' ? userData[column].toString() : userData[column])]
    // console.log('Persisted user data', values);



    execQuery(query, values)
        .catch((error) => {
            console.error('Persisting User Error', error);
        })

}

export async function getUserData(): Promise<{ tokens: Tokens, user: User, signedIn: number } | undefined> {
    return execQuery('SELECT * FROM user')
        .then((resultSet) => {
            const result = resultSet.rows._array[0]
            return result && separateInTokensAndUser(result)
        })
        .catch((error) => { console.error(error); })
}

/** Deletes the login data of the user: tokens, name, email, roles */
export async function deleteUserData() {
    execQuery('DELETE FROM user')
}


function separateInTokensAndUser(data: UserTable) {
    const tokens: Tokens = {
        refreshToken: data.refreshToken,
        accessToken: data.accessToken,
        expirationTimestamp: data.expirationTimestamp,
        refreshExpirationTimestamp: data.refreshExpirationTimestamp
    }
    const user = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        roles: data.roles,
    }
    const signedIn = data.signedIn
    return { tokens, user, signedIn }
}


export enum SendStatus { NOT_SENT, SENT, SENDING, FOR_SENDING }

/** Get the unsent measurements from localDB, and marks them as sending  */
export async function getMeasurements(): Promise<MeasurementForBack[]> {

    return execTransaction(
        [
            `SELECT * FROM ${tablesNames.MEASUREMENTS} WHERE sendStatus = ${SendStatus.NOT_SENT}`,
            // `SELECT * FROM measurements WHERE sendStatus = ${SendStatus.SENT}`,

            `UPDATE ${tablesNames.MEASUREMENTS} SET sendStatus = ${SendStatus.SENDING} WHERE sendStatus = ${SendStatus.NOT_SENT}`,
        ],
        [[], []]
    ).then((results) => {
        const measurements = results[0].rows._array;
        const forBackMeasurements = measurements.map((row) => {
            return measurementToBackendFormat(row)
        });
        console.log(forBackMeasurements);

        return forBackMeasurements
    })


}

export function measurementToBackendFormat(row: any): MeasurementForBack {
    return {

        timestamp: new Date(row.timestamp).toISOString(),
        height: row.height as number,
        location: [row.longitude,row.latitude] as [number, number],
    }
}

type SendableTables = 'measurements' | 'calibrationsFromMeasurements'

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


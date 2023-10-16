import { LatLng } from "react-native-maps"
import { execQuery, execTransaction } from "./localDB"
import { PaddockLocalDB, paddocksFromBackend } from "./types"
import { TablesNames } from "./tablesDefinition"

export async function getPaddocks() {
    return execQuery(
    `SELECT ID, name, vertices_list, color FROM paddocks`
    , [])
        .then((result) => result.rows._array as PaddockLocalDB[])
}

export async function getPaddockByID(paddockId: number) {
    return execQuery(
    `SELECT ID, name, vertices_list, color FROM paddocks WHERE ID = (?)`
    , [paddockId])
        .then((result) => result.rows._array[0] as PaddockLocalDB)
}

/** It gets the rows from the local db which comes from the server */
export async function getCrossedPaddocks(){
    return execTransaction([
        `SELECT * FROM ${TablesNames.PADDOCKS_FROM_SERVER}`
    ]).then((result)=>result[0].rows._array as paddocksFromBackend[])

}

export async function insertCrossedPaddock(name: string, vertices_list: LatLng[],uid:string, color?: string){
    const id = await insertPaddock(name,vertices_list,color);
    if (id) {
        return await execQuery(`INSERT INTO ${TablesNames.PADDOCKS_FROM_SERVER} (ID,UID) values (?,?)`, [id,uid])
            .then((result) => result.insertId as number) //It wont return undefined, in the case it doesnt insert an error will be thrown
    }
}

export async function removePaddock(ID: number) {
    return execQuery(`DELETE FROM paddocks WHERE ID = (?)`, [ID])
}

export async function removeAllPaddocks() {
    return execQuery(`DELETE FROM paddocks`)

}

export async function insertPaddock( paddockName: string,vertices_list: LatLng[], color?: string ) {
    let json = JSON.stringify(vertices_list)
    return execQuery(`INSERT INTO paddocks (name,color,vertices_list) values (?,?,?)`, [paddockName, color, json])
        .then((result) => result.insertId as number)
}

export async function modifyPaddock( paddockName: string, vertices_list: LatLng[], paddockId: number, color?: string ) {
    let json = JSON.stringify(vertices_list)
    return execQuery(`UPDATE paddocks SET vertices_list = (?), name = (?), color = (?) WHERE ID = (?)`, [json, paddockName, color, paddockId])
        .then((result) => result.insertId as number)
}

export async function updatePaddock( paddockName: string, vertices_list: LatLng[], paddockId: number, color?: string ) {
    modifyPaddock( paddockName, vertices_list, paddockId, color );
}
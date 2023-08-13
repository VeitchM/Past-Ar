import { LatLng } from "react-native-maps"
import { execQuery } from "./localDB"
import { PaddockLocalDB } from "./types"

export async function getPaddocks() {
    return execQuery(
    `SELECT ID, name, vertices_list FROM paddocks`
    , [])
        .then((result) => result.rows._array as PaddockLocalDB[])
}

export async function removePaddock(ID: number) {
    return execQuery(`DELETE FROM paddocks WHERE ID = (?)`, [ID])
}

export async function removeAllPaddocks() {
    return execQuery(`DELETE FROM paddocks`)

}

export async function insertPaddock( paddockName: string,vertices_list: LatLng[]) {
    let json = JSON.stringify(vertices_list)
    return execQuery(`INSERT INTO paddocks (name,vertices_list) values (?,?)`, [paddockName, json])
        .then((result) => result.insertId as number)

}

export async function modifyPaddock( paddockName: string,vertices_list: LatLng[], paddockId: number) {
    let json = JSON.stringify(vertices_list)
    return execQuery(`UPDATE paddocks SET vertices_list = (?), name = (?) WHERE ID = (?)`, [json, paddockName, paddockId])
        .then((result) => result.insertId as number)

}
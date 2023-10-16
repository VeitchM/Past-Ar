import { LatLng } from "react-native-maps"
import { execQuery, execTransaction } from "./localDB"
import { PaddockLocalDB, SectorLocalDB, paddocksFromBackend } from "./types"
import { TablesNames } from "./tablesDefinition"

export async function getSectors() {
    return execQuery(
    `SELECT ID, start_date, finish_date FROM sectors WHERE start_date != NULL AND finish_date != NULL ORDER BY start_date DESC`
    , [])
        .then((result) => result.rows._array as SectorLocalDB[])
}

export async function getSectorsBetween(from: number, until: number) {
    return execQuery(
    `SELECT ID, start_date, finish_date FROM sectors WHERE start_date > (?) AND finish_date < (?) ORDER BY start_date DESC`
    , [from,until])
        .then((result) => result.rows._array as SectorLocalDB[])
}

export async function getSectorByID(sectorId: number) {
    return execQuery(
    `SELECT ID, start_date, finish_date FROM sectors WHERE ID = (?)`
    , [sectorId])
        .then((result) => result.rows._array[0] as SectorLocalDB)
}

export async function removeSector(ID: number) {
    return execQuery(`DELETE FROM sectors WHERE ID = (?)`, [ID])
}

export async function removeAllSectors() {
    return execQuery(`DELETE FROM sectors`)

}

export async function startSector( start_date: number ) {
    return execQuery(`INSERT INTO sectors (start_date) values (?)`, [start_date])
        .then((result) => result.insertId as number)
}



export async function finishSector( sectorId: number, finish_date: number) {
    let _start_date = (await getSectorByID(sectorId)).start_date;
    // let _sectors_btw = await getSectorsBetween(_start_date,finish_date);
    //&& _sectors_btw != undefined && _sectors_btw.length >= 0
    if (_start_date != undefined ){
        return execQuery(`UPDATE sectors SET finish_date = (?) WHERE ID = (?)`, [finish_date, sectorId])
        .then((result) => result.insertId as number)
    }
}
import { LatLng } from "react-native-maps";
import { getCrossedPaddocks, insertCrossedPaddock, updatePaddock } from "../localDB/paddocks";
import store from "../store/store";
import { pushNotification } from "../pushNotification";
import { mobileAPI } from "./config";
import Permission from "./permission";
import { PaddockFromBack } from "./types";
import { createPayload } from "./utils";

declare interface paddockResponse {
    data: {
        content: any[],
        pageNumber: number,
        totalElements: number,
        totalPages: number
    },
    message: string
}

export async function synchronizePaddocks(foreground?: boolean): Promise<boolean> {
    try {

        // if (Permission.postPaddocks())
        //     await updatePaddocks(foreground)
        if (Permission.getPaddocks()) {
            await downloadPaddocks(foreground)
            console.log('FINISHED DOWLOADING PADDOCKS!!!');
        }
        return true
    }
    catch (e) {

        //It should not be necessary to setSending on error case
        //setSending(SendStatus.NOT_SENT, TablesNames.CALIBRATIONS_FROM_MEASUREMENTS)
        foreground && pushNotification('No se han podido sincronizar las calibraciones', 'error')
        //console.error(e)
        return false
    }
}

async function downloadPaddocks(foreground?: boolean) {
    const responseAllPaddocks = await getPaddocksFromBack()
    if (responseAllPaddocks) {
        if (responseAllPaddocks.length > 0) {
            updateLocalPaddocks(responseAllPaddocks);
        }
        foreground && pushNotification('Potreros sincronizados', 'success')
        return true
    }
    else {
        throw new Error(`Error loading paddocks`);
    }
}

export async function updateLocalPaddocks(paddocksFromBack: PaddockFromBack[]) {
    try {
        const crossedPaddocks = await getCrossedPaddocks()
        paddocksFromBack.forEach((paddock) => {
            const paddockFound = crossedPaddocks.find((item) => {
                return paddock.uid === item.uid
            })
            let vertices_list: LatLng[] = [];
            if (paddockFound) {
                paddock.geofence.coordinates[0].forEach((coord,index)=>{
                    const vertex = { latitude: Number.parseFloat(coord[1]), longitude: Number.parseFloat(coord[0]) };
                    vertices_list = [...vertices_list, vertex]
                    console.log(paddock.displayColor);
                })
                updatePaddock(paddock.name, vertices_list, paddockFound.ID, paddock.displayColor);
            }
            else {
                insertCrossedPaddock(paddock.name, vertices_list, paddock.uid, paddock.displayColor)
            }
        })
    }
    catch (err) {
        console.error('Error on updateLocalPaddocks', err);
    }
}

export async function getPaddocksFromBack() {
    /** API expects a paginated request
     *	Example:
     *  http://localhost:4000/api/v1/paddocks/?pageNumber=0&pageSize=5 
     */
    let results: PaddockFromBack[] = [];
    let pageNumber = 0;
    let endOfPages = false;
    while (!endOfPages) {
        console.log('PAGE READED!!!');
        let page = await fetch(`${mobileAPI}/paddocks/?pageNumber=${pageNumber}&pageSize=10`,
            createPayload('GET'))
        let response: paddockResponse = ((await page.json()));
        console.log(response);
        if (response && response.data && response.data.content) {
            if (response.data.totalPages > 0) {
                results = [...results, ...response.data.content];
                pageNumber = response.data.pageNumber + 1;
                endOfPages = response.data.pageNumber >= response.data.totalPages - 1;
            }
            else {
                results = [];
                pageNumber = 0;
                endOfPages = true;
            }
        }
    }
    console.log('Received Paddocks: ');
    console.log(results);
    console.log(results[0].geofence.coordinates[0]);
    return results;
}


/**
 * 
 * @param paddock 
 * @TODO set paddock type
 */
function postPaddock(paddock: any) {
    fetch(`${mobileAPI}/paddocks`,
        createPayload('POST', paddock))
        .then(async (res) => {
            const resObject = await res.json()
            console.log('Res from server post paddock', resObject);

            //TODO should do this recursive call, which is cut when signin is set to false
            //logedIn(resObject)
        })
}






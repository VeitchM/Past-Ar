import { mobileAPI } from "./config";
import { createPayload } from "./utils";





export function getPadocks() {
    /** The api is made to do a paginated request 
     * 
     *	Example:
     *  http://localhost:4000/api/v1/calibrations/?pageNumber=0&pageSize=5 
     */
    fetch(`${mobileAPI}/paddocks`,
        createPayload('GET'))
        .then(async (res) => {
            const resObject = await res.json()
            console.log('Paddocks from server', resObject);

            //TODO should do this recursive call, which is cut when signin is set to false
            //logedIn(resObject)
        })
}


/**
 * 
 * @param paddock 
 * @TODO set paddock type
 */
function postPadock(paddock: any) {
    fetch(`${mobileAPI}/paddocks`,
        createPayload('POST', paddock))
        .then(async (res) => {
            const resObject = await res.json()
            console.log('Res from server post paddock', resObject);

            //TODO should do this recursive call, which is cut when signin is set to false
            //logedIn(resObject)
        })
}






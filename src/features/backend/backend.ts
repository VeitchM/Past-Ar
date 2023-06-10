import { addNotification } from "../store/notificationSlice";
import store from "../store/store";
import { mobileAPI } from "./config";
import { getErrorLabel } from "./constants";




export function login(email: string, password: string) {
    fetch(`${mobileAPI}/auth/login`,
        createPayload('POST',
            { email: email, password: password }
        )).then(async (res) => {
            const resJSON = await res.json()
            console.log(resJSON);
            if (resJSON.code) {
                console.error(resJSON.message);
                store.dispatch(addNotification({ title: getErrorLabel(resJSON.code), status: 'error' }))


            }


        })
        .catch(error => {
            console.error(error);

            store.dispatch(addNotification({ title: getErrorLabel('FAILED_CONNECTION'), status: 'error' }))
        })



}


type RESTMethod = 'POST'


/** Create the load por a http request */
function createPayload(method: RESTMethod, body: Object) {

    return {
        method: method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }
}
import store from "../store/store"

type RESTMethod = 'POST' | 'GET'


/** Create the load por a http request */
export const  createPayload = (method: RESTMethod, body?: Object) => {

    const token = store.getState().backend.tokens?.accessToken

    const payload ={
        method: method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(token && { Authorization : 'Bearer ' + token}),
        },
        ...(body && {body: JSON.stringify(body)}),
    }
    console.log('Payload',payload);
    return payload;
    
}
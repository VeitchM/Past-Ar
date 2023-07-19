import { deleteUserData } from "../localDB/session";
import { setSignIn } from "../store/backendSlice";
import store from "../store/store";


export function signout(){
    deleteUserData()
    store.dispatch(setSignIn(false))
    // A little violent, with setting signin to false it will be okay
}
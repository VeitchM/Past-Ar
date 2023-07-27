import { useTypedSelector } from "../../features/store/storeHooks"
import SignedinScreen from "./SignedinScreen"
import SigninScreen from "./SigninScreen"


export default function UserScreen() {
    const signedIn = useTypedSelector(state => state.backend.signIn)
    return (
        <>
            {
                signedIn ?
                    <SignedinScreen />
                    :
                    <SigninScreen />
            }
        </>
    )
}
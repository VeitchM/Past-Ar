import { persistUserData, deleteUserData } from "../localDB/session";
import {
  Tokens,
  TokensResponse,
  User,
  setSignIn,
  setTokens,
  setUser,
} from "../store/backendSlice";
import { addNotification } from "../store/notificationSlice";
import store from "../store/store";
import { pushNotification } from "../pushNotification";
import { mobileAPI } from "./config";
import { getErrorLabel } from "./constants";
import { SYNCHRONIZE_INTERVAL, synchronize } from "./synchronize";
import { createPayload } from "./utils";
import jwtDecode from "jwt-decode";

// It could be a class

/** Id of refreshToken's set_interval()*/
let unsubscribeRefreshToken: number;
/** Id of refreshToken's set_interval()*/
let unsubscribeSynchronize: number;

export function signout() {
  clearInterval(unsubscribeRefreshToken);
  clearInterval(unsubscribeSynchronize);
  deleteUserData();
  store.dispatch(setSignIn(false));
  // A little violent, with setting signin to false it will be okay
}

/** Sends email and password to backend and signsin */
export async function signin(email: string, password: string) {
  return fetch(
    `${mobileAPI}/auth/login`,
    createPayload("POST", { email: email, password: password })
  )
    .then(async (res) => {
      const resObject = await res.json();
      console.log(resObject);
      if (resObject.code) {
        console.error(resObject.message);
        pushNotification(getErrorLabel(resObject.code), "error", false);
      } else {
        signedIn(resObject);
        setRefreshTokenInterval();
      }
    })
    .catch((error) => {
      console.error(error);

      pushNotification(getErrorLabel("FAILED_CONNECTION"), "error", false);
    });
}

/** It sets the redux with the proper info once the user signin, it also persists the user info and tokens
 *
 * @params res : it should be a successful server response, not an error response
 */
function signedIn(res: TokensResponse) {
  const tokens = tokensFromBackendToStore(res);
  const userData = getUserData(tokens.accessToken!);

  store.dispatch(setTokens(tokens));
  store.dispatch(setUser(userData));
  store.dispatch(setSignIn(true));

  persistUserData({ ...tokens, ...userData, signedIn: true });

  synchronize();
  setSynchronizeDataInterval();
  setRefreshTokenInterval();

  console.log("Signed in", new Date());
}

function setRefreshTokenInterval() {
  clearInterval(unsubscribeRefreshToken);
  const tokens = store.getState().backend.tokens;
  unsubscribeRefreshToken = setInterval(() => {
    refreshToken();
  }, tokens!.expiresIn! * 0.9) as unknown as number;

  console.log({ unsubscribeRefreshToken });
}

function setSynchronizeDataInterval() {
  clearInterval(unsubscribeSynchronize);
  unsubscribeSynchronize = setInterval(() => {
    synchronize();
  }, SYNCHRONIZE_INTERVAL) as unknown as number;
}

/** It sets a refresh interval and will force a first refresh for the tokens
 * It sets the the synchronize interval and force a first one if it is no loged in
 */
export function onInitSessionRoutine() {
  refreshToken();
  setRefreshTokenInterval();
  synchronize();
  setSynchronizeDataInterval();
}

/** Get user info from the provided token
 * @returns  User info
 */
function getUserData(token: string) {
  //Get locally without authentication, with https it shouldn't be possible to have a MitM attack
  const { id, firstName, lastName, email, roles, groupUid }: User =
    jwtDecode(token);
  return { id, firstName, lastName, email, roles, groupUid };
}

export function refreshToken() {
  const backendState = store.getState().backend;
  console.log("Refresh token sent for refresh token API:");
  console.log(backendState.tokens?.refreshToken);

  if (backendState.signIn) {
    fetch(
      `${mobileAPI}/auth/refreshToken`,
      createPayload("POST", {
        refresh_token: "" + backendState.tokens?.refreshToken,
      })
    ).then(async (res) => {
      const resObject = await res.json();
      // console.log('Refresh token from server', resObject);

      //Double check, i may disconnect while waiting for the answer
      if (backendState.signIn) {
        if (!resObject.code) {
          signedIn(resObject);
        } else {
          if (
            backendState.tokens?.refreshExpiresIn! +
              backendState.tokens?.timestamp! <
            Date.now()
          ) {
            console.error("Error refreshing token", resObject);
          } else {
            console.error("Refresh token not active", resObject);
            signout();
          }
        }
      }
    });
  }
}

/** It translate the tokens given by the backend to the ones saved on the store */
function tokensFromBackendToStore(serverTokens: TokensResponse): Tokens {
  return {
    refreshToken: serverTokens.refresh_token,
    accessToken: serverTokens.access_token,
    timestamp: Date.now(),
    expiresIn: serverTokens.expires_in * 1000,
    refreshExpiresIn: serverTokens.refresh_expires_in * 1000,
  };
}

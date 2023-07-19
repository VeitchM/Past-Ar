
import { Tokens, User } from "../store/backendSlice";
import { execQuery, execTransaction } from "./localDB";



type UserTable = (Tokens & User & { signedIn: boolean, localId: number })


const columns: Array<keyof Omit<UserTable, 'localId'>> =
    [
        // 'localId',
        'refreshToken',
        'accessToken',
        'expirationTimestamp',
        'refreshExpirationTimestamp',
        'id',
        'firstName',
        'lastName',
        'email',
        'roles',
        'groupUid',
        'signedIn'
    ]

const placeHolder = new Array(columns.length + 1).fill('?').toString()
console.log('Placeholder', placeHolder);


export function persistUserData(userData: Omit<UserTable, 'localId'>) {

    const query = `INSERT OR REPLACE INTO user (localId,${columns.toString()}) values (${placeHolder})`
    const values = [0, ...columns.map((column) => column == 'roles' ? userData[column].toString() : userData[column])]
    // console.log('Persisted user data', values);



    execQuery(query, values)
        .catch((error) => {
            console.error('Persisting User Error', error);
        })

}

export async function getUserData(): Promise<{ tokens: Tokens, user: User, signedIn: number } | undefined> {
    return execQuery('SELECT * FROM user')
        .then((resultSet) => {
            const result = resultSet.rows._array[0]
            return result && separateInTokensAndUser(result)
        })
        .catch((error) => { console.error(error); })
}

/** Deletes the login data of the user: tokens, name, email, roles */
export async function deleteUserData() {
    execQuery('DELETE FROM user')
}


function separateInTokensAndUser(data: UserTable) {
    const tokens: Tokens = {
        refreshToken: data.refreshToken,
        accessToken: data.accessToken,
        expirationTimestamp: data.expirationTimestamp,
        refreshExpirationTimestamp: data.refreshExpirationTimestamp
    }
    const user = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        roles: data.roles,
    }
    const signedIn = data.signedIn
    return { tokens, user, signedIn }
}

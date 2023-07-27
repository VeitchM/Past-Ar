import store from "../store/store"

export enum Roles {
    WORKER = 'worker',
    VIEWER = 'viewer',
    ADMIN = 'admin',
    OWNER = 'owner'
}

export default class Permission {
    private static hasPermission(permissions: String[]): boolean {
        const roles = store.getState().backend.user?.roles
        return !!roles && roles.map(rol => permissions.includes(rol)).includes(true)


    }
    static getMeasurements(): boolean {
        return Permission.hasPermission([Roles.OWNER, Roles.ADMIN, Roles.VIEWER])
    }

    static postMeasurements(): boolean {
        return Permission.hasPermission([Roles.OWNER, Roles.ADMIN, Roles.WORKER])
    }

    static getCalibrations(): boolean {
        return Permission.hasPermission([Roles.OWNER, Roles.ADMIN, Roles.WORKER,Roles.VIEWER])
    }

    static postCalibrations(): boolean {
        return Permission.hasPermission([Roles.OWNER, Roles.ADMIN, Roles.WORKER])
    }


}
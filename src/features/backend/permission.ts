import store from "../store/store"

export enum Roles {
    WORKER = 'worker',
    VIEWER = 'viewer',
    ADMIN = 'admin',
    OWNER = 'owner'
}

export default class Permission {
    private static hasPermission(permissions: String[]): boolean {
        const user = store.getState().backend.user;
        const roles = (user && user.roles) ? user.roles : [];
        return !!roles ? roles.map(rol => permissions.includes(rol)).includes(true) : false
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

    static getPaddocks(): boolean {
        return Permission.hasPermission([Roles.OWNER,Roles.ADMIN,Roles.WORKER,Roles.VIEWER])
    }

    static postPaddocks(): boolean {
        return Permission.hasPermission([Roles.OWNER, Roles.ADMIN, Roles.WORKER])
    }
}
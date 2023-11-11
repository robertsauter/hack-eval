/** Meant to store application-wide state
 * At the moment, changes to this store will not trigger automatic updates
 * If automatic updates are needed, maybe rxjs would be a good option
 */
class Store {
    private _loggedIn = false;
    private _logoutTimerId: number | null = null;

    get loggedIn() {
        return this._loggedIn;
    }

    set loggedIn(loggedIn: boolean) {
        this._loggedIn = loggedIn;
    }

    get logoutTimerId(): number | null {
        return this._logoutTimerId;
    }

    set logoutTimerId(logoutTimerId: number) {
        this._logoutTimerId = logoutTimerId;
    }
}

export const store = new Store();
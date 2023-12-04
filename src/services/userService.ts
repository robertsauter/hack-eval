import { BehaviorSubject } from 'rxjs';
import type { Token } from '../models/Token';
import { redirect } from 'react-router-dom';
import { httpService } from './HttpService';

/** Class to handle everything regarding user authentication */
class UserService {
    loggedIn$ = new BehaviorSubject(!!window.localStorage.getItem('access_token'));
    logoutTimerId: number | null = null;

    constructor() {
        this.redirectIfNotLoggedIn = this.redirectIfNotLoggedIn.bind(this);
        this.redirectIfLoggedIn = this.redirectIfLoggedIn.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
        this._setTokenExpirationTimer = this._setTokenExpirationTimer.bind(this);
    }

    /** Register a new user */
    register(formData: FormData) {
        return httpService.post('/users', { body: formData });
    }

    /** Login an existing user */
    async login(formData: FormData) {
        const response = await httpService.post('/users/login', { body: formData });

        if(response.ok) {
            const token: Token = await response.json();
            window.localStorage.setItem('access_token', JSON.stringify(token));
            this.handleLoginSuccess(token);
        }
        return response;
    }

    /** Update loggedIn subject and set expiration timer */
    handleLoginSuccess(token: Token) {
        this.loggedIn$.next(true);
        this._setTokenExpirationTimer(token.access_token);
    }

    /** Logout a user */
    logout() {
        window.localStorage.removeItem('access_token');
        this.loggedIn$.next(false);
        if(this.logoutTimerId) {
            clearTimeout(this.logoutTimerId);
        }
    }

    /** Redirect, if user is not logged in. Can be used as a guard for pages, that should not be accessed
     * when user is not logged in. */
    redirectIfNotLoggedIn() {
        if(!this.loggedIn$?.getValue()) {
            return redirect('/login');
        }
        return null;
    }

    /** Redirect, if user is logged in. Can be used as a guard for pages, that should not be accessed
     * when user is logged in. */
    redirectIfLoggedIn() {
        if(this.loggedIn$.getValue()) {
            return redirect('/');
        }
        return null;
    }

    /** Set timer to logout user, as soon as the token expires */
    private _setTokenExpirationTimer(token: string) {
        //Get payload of jwt token and decode it
        const payloadEncoded = token.split('.')[1];
        const payload: { sub: string,  exp: number } = JSON.parse(atob(payloadEncoded));

        //Set timer
        const expirationTime = new Date(payload.exp * 1000).getTime() - new Date().getTime();
        const timerId = setTimeout(() => {
            window.localStorage.removeItem('access_token');
            this.loggedIn$.next(false);
        }, expirationTime);
        //Timer id is saved, so that the timer can be cleared, when a user logs out manually
        this.logoutTimerId = timerId;
    }
}

export const userService = new UserService();
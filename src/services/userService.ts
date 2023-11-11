import { BehaviorSubject } from 'rxjs';
import { Token } from '../models/Token';
import { redirect } from 'react-router-dom';

class UserService {
    loggedIn$ = new BehaviorSubject(!!window.localStorage.getItem('access_token'));
    logoutTimerId: number | null = null;

    constructor() {
        this.redirectIfNotLoggedIn = this.redirectIfNotLoggedIn.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    }

    /** Register a new user */
    async register(formData: FormData) {
        const response = await fetch('http://127.0.0.1:8000/users', {
            method: 'POST',
            body: formData
        });

        if(response.ok) {
            return true;
        }
        return false;
    }

    /** Login an existing user */
    async login(formData: FormData) {
        const response = await fetch('http://127.0.0.1:8000/users/login', {
            method: 'POST',
            body: formData
        });

        if(response.ok) {
            const token: Token = await response.json();
            window.localStorage.setItem('access_token', JSON.stringify(token));
            this.handleLoginSuccess(token);
            return true;
        }
        return false;
    }

    handleLoginSuccess(token: Token) {
        this.loggedIn$.next(true);
        this._setTokenExpirationTimer(token.access_token);
    }

    logout() {
        this.loggedIn$.next(false);
        if(this.logoutTimerId) {
            clearTimeout(this.logoutTimerId);
        }
    }

    redirectIfNotLoggedIn() {
        if(!this.loggedIn$?.getValue()) {
            return redirect('/login');
        }
        return null;
    }

    /** Set timer to logout the user, as soon as the token expires */
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
import { redirect } from 'react-router-dom';
import { store } from './Store';
import { Token } from '../models/Token';

/** Set timer to logout the user, as soon as the token expires */
function setTokenExpirationTimer(token: string) {
    //Get payload of jwt token and decode it
    const payloadEncoded = token.split('.')[1];
    const payload: { sub: string,  exp: number } = JSON.parse(atob(payloadEncoded));

    //Set timer
    const expirationTime = new Date(payload.exp * 1000).getTime() - new Date().getTime();
    const timerId = setTimeout(() => {
        window.localStorage.removeItem('access_token');
    }, expirationTime);
    //Timer id is saved, so that the timer can be cleared, when a user logs out manually
    store.logoutTimerId = timerId;
}

/** Set user as logged in and save access token */
export function setUserLoggedIn(token: Token) {
    store.loggedIn = true;
    window.localStorage.setItem('access_token', JSON.stringify(token));
    setTokenExpirationTimer(token.access_token);
}

/** Set user as logged out */
export function setUserLoggedOut() {
    store.loggedIn = false;
    window.localStorage.removeItem('access_token');
    if(store.logoutTimerId) {
      clearTimeout(store.logoutTimerId);
    }
}

/** Redirect to login, if user is not logged in, to be used as loader function for routes, see App.tsx */
export function redirectIfNotLoggedIn() {
    if(!store.loggedIn) {
        return redirect('/login');
    }
    return null;
}
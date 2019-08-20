import { BehaviorSubject } from 'rxjs';

import { handleResponse } from '../_helpers';
import { config } from './config';

var user;
if (typeof window !== 'undefined') {
    user = JSON.parse(localStorage.getItem('currentUser'));
}

const currentUserSubject = new BehaviorSubject(user);

export const authenticationService = {
    login,
    logout,
    sendResetLink,
    loginWithReset,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${config.ostApiUrl}/v1/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        }).catch(error => {
            console.log(error);
            return Promise.reject(error);
        });
}

function loginWithReset(username, password, genhash) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, genhash })
    };

    return fetch(`${config.ostApiUrl}/v1/login/reset`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}

function sendResetLink(username) {

    return genHash(username).then(genhash => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, link: `${location.origin}/auth?genhash=${genhash}` })
        };

        return fetch(`${config.mailerApiUrl}/users/authenticate/reset/link`, requestOptions)
            .then(response => {
                return response.json()
            })
            .then(data => {
                if ([400].indexOf(data.status) !== -1) {

                    return Promise.reject('Error sending email');
                }
                return data.message;
            }).catch(error => {
                return Promise.reject(error);
            },
                err => {
                    return Promise.reject(err);
                }
            );
    })
}

function genHash(username) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    };

    return fetch(`${config.ostApiUrl}/v1/login/genhash`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res.genhash;
        });
}


function logout() {
    // remove user from local storage to log user out
    if (typeof window !== 'undefined') localStorage.removeItem('currentUser');
    currentUserSubject.next(null);

}

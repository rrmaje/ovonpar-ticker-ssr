import { authHeader, handleResponse} from '../_helpers';
import {config} from './config';

export const userService = {
    getAll,newUser
};

function getAll() {
    const requestOptions = { method: 'POST', headers: authHeader() };
    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function newUser(username,password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username,password})
    };
    return fetch(`${config.apiUrl}/user`, requestOptions).then(handleResponse);
}

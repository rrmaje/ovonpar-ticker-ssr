import { authenticationService } from '../_services';

export function authHeader() {
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return { OST: `${currentUser.token}` };
    } else {
        return {};
    }
}

export function authHeaderWithContentType() {
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return { 'Content-Type': 'application/json' , OST: `${currentUser.token}` };
    } else {
        return {};
    }
}
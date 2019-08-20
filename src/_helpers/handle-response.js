import { authenticationService } from '../_services';

export function handleResponse(response) {

    return response.json().then(responseJson => {
        const data = responseJson && responseJson.message
        if (responseJson && 200 !== responseJson.status) {
            if ([400, 401, 403, 500].indexOf(responseJson.status) !== -1) {
                authenticationService.logout();
            }

            const error = data || responseJson.statusText;
            return Promise.reject(error);
        }

        return data;
    }
    );

}
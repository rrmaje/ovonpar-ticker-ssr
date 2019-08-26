import { authHeaderWithContentType, authHeader, handleResponse} from '../_helpers';
import {config} from './config';

export const orderEntry = {
    newOrder, getOrders, cancelOrder
};

function getOrders() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.ostApiUrl}/v1/orders`, requestOptions).then(handleResponse);
}

function newOrder(side, instrument, quantity, price) {
    const requestOptions = {
        method: 'POST',
        headers: authHeaderWithContentType(),
        body: JSON.stringify({side, instrument, quantity, price})
    };
    return fetch(`${config.ostApiUrl}/v2/orders/new`, requestOptions).then(handleResponse);
}

function cancelOrder(orderId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeaderWithContentType(),
        body: JSON.stringify({orderId})
    };
    return fetch(`${config.ostApiUrl}/v2/orders/cancel`, requestOptions).then(handleResponse);
}

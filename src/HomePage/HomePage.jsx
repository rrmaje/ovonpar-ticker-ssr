import React from 'react';

import { userService, authenticationService } from '../_services';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            users: null
        };
    }

    render() {
        const { currentUser, users } = this.state;
        return (
            <div>
                <p>You're logged in as {currentUser.username}</p>
                <h2>Stock Ticker supports single session only in the current version. Market Reporting and Best Bid Offers are for the current session. Sessions start 8.00AM CET and end 4.00PM CET Monday through Friday.</h2>
                <h2>Stock Ticker is not Trading Venue - it is not offering Financial Intruments under MiFID. Spot trading is facilitated by the service.</h2>
                <h3>Thank you for using Ovonpar Stock Ticker</h3>
            </div>
        );
    }
}

export { HomePage };
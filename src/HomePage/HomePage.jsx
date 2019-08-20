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
            </div>
        );
    }
}

export { HomePage };
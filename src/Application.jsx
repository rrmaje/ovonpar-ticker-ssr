import React from 'react';

import SignIn from './SignIn.jsx';
import SignUp from './SignUp.jsx';
import ResetPassword from './ResetPassword.jsx';
import AuthenticateWithReset from './AuthenticateWithReset.jsx';
import {
  Route,
  Switch,
  NavLink,
} from 'react-router-dom';

import Instruments from './Instruments.jsx';
import Trades from './Trades.jsx';

import { CssBaseline } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { Container } from '@material-ui/core';


import { history } from './_helpers';
import { authenticationService } from './_services';
import { PrivateRoute } from './_components';
import { HomePage } from './HomePage';
import './Application.css'


export default class Application extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: null
    };
  }

  componentDidMount() {
    authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
  }

  logout() {
    authenticationService.logout();
    history.push('/signin');
  }

  render() {
    const { currentUser } = this.state;
    return (
	    <div>
        <CssBaseline />
        <Container style={{ padding: 0 }} maxWidth="xl">
            <Box my={2}>
              <h1 className="logoheader">Ovonpar Stock Ticker</h1>
              <div className="topnav">   
                {currentUser &&
                  <div>
                    <NavLink exact activeClassName="active" to="/">Home</NavLink>
                    <NavLink exact activeClassName="active" to="/instruments">Instruments</NavLink>{' '}
                    <NavLink exact activeClassName="active" to="/trades">Trades</NavLink>{' '}
                    <NavLink onClick={this.logout} to="/signin">Logout</NavLink>
                  </div>
                }
              </div>
            </Box>
            <Box my={4} mx={2}>
              <Switch>
                <Route path="/signin" component={SignIn} />
                <Route path="/auth" component={AuthenticateWithReset} />
                <Route path="/reset" component={ResetPassword} />
                <Route path="/signup" component={SignUp} />
                <Route exact path="/instruments" component={Instruments} />
                <Route exact path="/trades" component={Trades} />
                <PrivateRoute exact path="/" component={HomePage} />
                <Route render={() => <h1>Page not found</h1>} />
              </Switch>
            </Box>


          <div className="footer">© 2019 Ovonpar Stock Ticker. All rights reserved | <a href="#">Terms of Service</a></div>
        </Container>
	    </div>
    );
  }
}

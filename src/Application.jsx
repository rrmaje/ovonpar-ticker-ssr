import React from 'react';

import SignIn from './_components/SignIn.jsx';
import SignUp from './_components/SignUp.jsx';
import ResetPassword from './_components/ResetPassword.jsx';
import AuthenticateWithReset from './_components/AuthenticateWithReset.jsx';
import {
  Route,
  Switch,
  NavLink,
} from 'react-router-dom';

import Instruments from './_components/Instruments.jsx';
import Trades from './_components/Trades.jsx';

import { CssBaseline } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { Container } from '@material-ui/core';


//import { history } from './_helpers';
import { authenticationService } from './_services';
import { PrivateRoute } from './_components';
import { HomePage, Terms } from './HomePage';
import './Application.css'


export default class Application extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null
    };

  }

  componentDidMount() {
    this._isMounted = true;
    authenticationService.currentUser.subscribe(x => {

      if (this._isMounted) {
        this.setState({ currentUser: x })
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  logout() {
    authenticationService.logout();
    //this.props.history.push('/signin');
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
                  <NavLink exact activeClassName="active" to="/instruments">Market Data</NavLink>{' '}
                  <NavLink exact activeClassName="active" to="/trades">Trade Events</NavLink>{' '}
                  <NavLink onClick={this.logout} to="/signin" style={{ float: 'right', paddingRight: 20 }}>Logout</NavLink>
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
              <Route path="/terms" component={Terms} />
              <Route exact path="/instruments" component={Instruments} />
              <Route exact path="/trades" component={Trades} />
              <PrivateRoute exact path="/" component={HomePage} />
              <Route render={() => <h1>Page not found</h1>} />
            </Switch>
          </Box>
          </Container>

          <div className="footer">© 2019 Ovonpar Stock Ticker. All rights reserved | <NavLink exact to="/terms" activeClassName="footerActive" style={{ color: 'white' }}>Terms of Service</NavLink></div>
        
      </div>
    );
  }
}

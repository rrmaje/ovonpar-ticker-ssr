import React from 'react';

import Trade from './Trade.jsx';
import { config } from '../_services';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';


import { Container } from '@material-ui/core';
import { authenticationService } from '../_services';
import { withStyles } from '@material-ui/styles';




const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
    overflowX: 'auto',
  },
  title: {
    padding: 14,
  },
  table: {
    minWidth: 650,
  },
  tableCell: {
    color: '#00251a',
  },
});

var extend = function (out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i])
      continue;

    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key))
        out[key] = arguments[i][key];
    }
  }

  return out;
};



class Trades extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state =
      { instruments: {}, trades: [], page: 0, rowsPerPage: 10 };

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  handleChangePage(event, newPage) {
    this.setState({ page: newPage });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
    this.setState({ page: 0 });
  }

  componentDidMount() {
    this._isMounted = true;

    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {

      var socket = new WebSocket(`${config.marketGatewayUrl}/trades?OST=${currentUser.token}`);
      console.log('Mount');
      socket.onmessage = function (event) {
        var message = JSON.parse(event.data);
        var messageType = message.type;
        delete message.type;
        if (this._isMounted) {
          if (messageType === "Trade") {
            var trades = this.state.trades;
            trades.push(message);

            this.setState({ trades: trades });
          } else if (messageType === "Instrument") {
            var instruments = extend({}, this.state.instruments);

            instruments[message.instrument] = message;

            this.setState({ instruments: instruments });
          }
        }
      }.bind(this);

      socket.onerror = function (event) {
        console.error(event);
      }.bind(this);

      socket.onclose = function (event) {
        console.log('Market Gateway connection closed');
      }.bind(this);
    }

  }

  componentWillUnmount() {
    this._isMounted = false;
    console.log('Unmount');
  }

  render() {



    const classes = this.props.classes;

    var instruments = this.state.instruments;

    var tradeNodes = this.state.trades.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(function (t) {
      const k = t.buyOrderNumber + '-' + t.timestamp + '-' + t.sellOrderNumber+'-'+t.matchNumber;
      return (
        <Trade key={k}
          instrument={instruments[t.instrument]}
          trade={t} />
      );
    });
    return (

      <Container>
        <Paper className={classes.root}>
          <div className={classes.title}>
            <strong>Matched orders within current session</strong>
          </div>
          <Table className={classes.table} size="medium">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}>Timestamp</TableCell>
                <TableCell className={classes.tableCell} align="right">Match no.</TableCell>
                <TableCell className={classes.tableCell} align="right">Buy order no.</TableCell>
                <TableCell className={classes.tableCell} align="right">Sell order no.</TableCell>
                <TableCell className={classes.tableCell} align="right">Instrument</TableCell>
                <TableCell className={classes.tableCell} align="right">Price</TableCell>
                <TableCell className={classes.tableCell} align="right">Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tradeNodes}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={this.state.trades.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            backIconButtonProps={{
              'aria-label': 'previous page',
            }}
            nextIconButtonProps={{
              'aria-label': 'next page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>

      </Container>
    );
  }
}

export default withStyles(styles)(Trades);
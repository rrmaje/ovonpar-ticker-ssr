import React from 'react';

import Instrument from './Instrument.jsx';
import { config } from '../_services';

import { withStyles } from '@material-ui/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Container } from '@material-ui/core';



const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
    overflowX: 'auto',
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

class Instruments extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state =
      { instruments: {}, bbos: {}, trades: {} };
  }



  componentDidMount() {
    this._isMounted = true;
    var socket = new WebSocket(`${config.marketGatewayUrl}` + "/data");

    socket.onmessage = function (event) {
      var message = JSON.parse(event.data);
      var messageType = message.type;
      delete message.type;
      if (this._isMounted) {
        if (messageType === "Trade") {
          var trades = extend({}, this.state.trades);

          trades[message.instrument] = message;

          this.setState({ trades: trades });
        } else if (messageType === "BBO") {
          var bbos = extend({}, this.state.bbos);

          bbos[message.instrument] = message;

          this.setState({ bbos: bbos });
        } else if (messageType === "Instrument") {
          var instruments = extend({}, this.state.instruments);

          instruments[message.instrument] = message;

          this.setState({ instruments: instruments });
        }
      }
    }.bind(this);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const classes = this.props.classes;
    var instruments = Object.keys(this.state.instruments).sort();
    var instrumentNodes = instruments.map(function (instrument) {
      return (
        <Instrument key={instrument}
          instrument={this.state.instruments[instrument]}
          bbo={this.state.bbos[instrument]}
          trade={this.state.trades[instrument]} />
      );
    }.bind(this));
    return (
<Container>
<Paper className={classes.root}>
  <Table className={classes.table} size="medium">
    <TableHead>
      <TableRow>
        <TableCell className={classes.tableCell}>Instrument</TableCell>
        <TableCell className={classes.tableCell} align="right">Bid Price</TableCell>
        <TableCell className={classes.tableCell} align="right">Bid Quantity</TableCell>
        <TableCell className={classes.tableCell} align="right">Ask Price</TableCell>
        <TableCell className={classes.tableCell} align="right">Ask Quantity</TableCell>
        <TableCell className={classes.tableCell} align="right">Last Price</TableCell>
        <TableCell className={classes.tableCell} align="right">Last Quantity</TableCell>
        <TableCell className={classes.tableCell} align="right">-</TableCell>
        <TableCell className={classes.tableCell} align="right">-</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
    {instrumentNodes}
    </TableBody>
  </Table>
  </Paper>
  </Container>

    );
  }
}

export default withStyles(styles)(Instruments);

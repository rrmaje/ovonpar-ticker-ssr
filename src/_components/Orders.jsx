import React from 'react';
import { config } from '../_services';
import { Button } from '@material-ui/core';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';


import { Container } from '@material-ui/core';
import { orderEntry, authenticationService  } from '../_services';
import { withStyles } from '@material-ui/styles';




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


class Orders extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state =
      {instruments: {}, orders: [], page: 0, rowsPerPage: 10 };

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

      orderEntry.getOrders()
      .then(
        result => {
          result.instruments.forEach(i => {
            var instruments = extend({}, this.state.instruments);
            instruments[i.instrument] = i;
            this.setState({ instruments: instruments });
          });
      
          this.setState({ orders: result.ordersResponse.orders });
        },
        error => {
          console.error(error);
        }
      );
     
    }

  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  cancelOrder(i){
    const orders = this.state.orders;
    orderEntry.cancelOrder(orders[i].orderId)
    orders.splice(i, 1);
    this.setState({ orders });
  }

  

  render() {

    const formatSide = (side) => {
      return side == 83 ? 'Sell' : 'Buy';
    }

    const formatTextField = (container, name) => {
      return !container || !container[name] ? '—' : container[name] ;
    }
    const formatField = (container, name, factor, fractionalDigits) => {
      return !container || !container[name] ? '—' : (container[name] / factor).toFixed(fractionalDigits);
    }
  
    const formatPrice = (container, name, instrument) => {
      return formatField(container, name, instrument.priceFactor, instrument.priceFractionDigits);
    }
  
    const formatSize = (container, name, instrument) => {
      return formatField(container, name, instrument.sizeFactor, instrument.sizeFractionDigits);
    }

    const classes = this.props.classes;

    var instruments = this.state.instruments;

    var orderNodes = this.state.orders.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(function (o,i) {
      const k = o.orderId;
      const instrument = instruments[o.instrument];
      
      return (
          <TableRow key={k}>
          <TableCell component="th" scope="row">
            {k}
          </TableCell>
          <TableCell align="right">{formatSide(o.side)}</TableCell>
          <TableCell align="right">{o.instrument}</TableCell>
          <TableCell align="right">{formatPrice(o, "price",instrument)}</TableCell>
          <TableCell align="right">{formatSize(o, "quantity",instrument)}</TableCell>
          <TableCell align="right"><Button onClick={this.cancelOrder.bind(this,i)} 
          color="primary">Cancel</Button></TableCell>
        </TableRow>
      );
    },this);
    return (

      <Container>
        <Paper className={classes.root}>
          <Table className={classes.table} size="medium">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}>Order ID</TableCell>
                <TableCell className={classes.tableCell} align="right">Side</TableCell>
                <TableCell className={classes.tableCell} align="right">Instrument</TableCell>
                <TableCell className={classes.tableCell} align="right">Quantity</TableCell>
                <TableCell className={classes.tableCell} align="right">Price</TableCell>
                <TableCell className={classes.tableCell} align="right">-</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderNodes}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={this.state.orders.length}
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

export default withStyles(styles)(Orders);
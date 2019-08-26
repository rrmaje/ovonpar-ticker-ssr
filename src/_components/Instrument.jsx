import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Link } from 'react-router-dom';


export default class Instrument extends React.Component {
  formatField(container, name, factor, fractionalDigits) {
    return !container || !container[name] ? '—' : (container[name] / factor).toFixed(fractionalDigits);
  }

  formatPrice(container, name) {
    return this.formatField(container, name, this.props.instrument.priceFactor, this.props.instrument.priceFractionDigits);
  }

  formatSize(container, name) {
    return this.formatField(container, name, this.props.instrument.sizeFactor, this.props.instrument.sizeFractionDigits);
  }

  render() {
    return (

      <TableRow key={this.props.instrument.instrument}>
        <TableCell component="th" scope="row">
          {this.props.instrument.instrument}
        </TableCell>
        <TableCell align="right">{this.formatPrice(this.props.bbo, "bidPrice")}</TableCell>
        <TableCell align="right">{this.formatSize(this.props.bbo, "bidSize")}</TableCell>
        <TableCell align="right">{this.formatPrice(this.props.bbo, "askPrice")}</TableCell>
        <TableCell align="right">{this.formatSize(this.props.bbo, "askSize")}</TableCell>
        <TableCell align="right">{this.formatPrice(this.props.trade, "price")}</TableCell>
        <TableCell align="right">{this.formatSize(this.props.trade, "size")}</TableCell>
        <TableCell align="right"><Link to= {{
  pathname: '/orders/new',
  state: {
    side: 66,
    instrument: this.props.instrument.instrument
  }}}>Buy</Link></TableCell>
        <TableCell align="right"><Link to= {{
  pathname: '/orders/new',
  state: {
    side: 83,
    instrument: this.props.instrument.instrument
  }}}>Sell</Link></TableCell>
        
      </TableRow>
    );
  }
}


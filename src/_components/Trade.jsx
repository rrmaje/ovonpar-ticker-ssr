import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export default class Trade extends React.Component{
  formatTextField(container, name) {
    return !container || !container[name] ? '—' : container[name] ;
  }
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
        <TableRow key={this.props.trade.buyOrderNumber+'-'+this.props.trade.timestamp+'-'+this.props.trade.sellOrderNumber}>
          <TableCell component="th" scope="row">
            {this.props.trade.matchNumber}
          </TableCell>
          <TableCell align="right">{this.formatTextField(this.props.trade, "buyOrderNumber")}</TableCell>
          <TableCell align="right">{this.formatTextField(this.props.trade, "sellOrderNumber")}</TableCell>
          <TableCell align="right">{this.props.trade.timestamp}</TableCell>
          <TableCell align="right">{this.props.trade.instrument}</TableCell>
          <TableCell align="right">{this.formatPrice(this.props.trade, "price")}</TableCell>
          <TableCell align="right">{this.formatSize(this.props.trade, "size")}</TableCell>
        </TableRow>
 
      
    );
  }
}


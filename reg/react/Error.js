import React, { Component } from 'react';
import { bool, string } from 'prop-types';

// XXX use theme-clair/src/atoms/InputError
export default class Error extends Component {
  static propTypes = {
    message: string,
    show: bool,
  }

  render() {
    return this.props.show ? <span className="error">{this.props.message}</span> : null;
  }
}

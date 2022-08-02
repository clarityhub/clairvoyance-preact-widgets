import React, { Component } from 'react';
import { func, string } from 'prop-types';
import { connect } from 'react-redux';
import { authClient } from '../../auth/actions';
import {
  getSocketToken,
  reconnecting,
  reconnected,
  reconnectFailed,
} from '../actions';
import { handleEvent } from '../handler';
import Socket from '../Socket';

import SocketStatus from './SocketStatus';

class ChatSocket extends Component {
  static propTypes = {
    apiKey: string,
    authClient: func.isRequired,
    cookie: string,
    getSocketToken: func.isRequired,
    rtcUrl: string,
  }

  componentDidMount() {
    const { rtcUrl, apiKey, cookie, handleReconnected, handleReconnectFailed } = this.props;

    this.connect(rtcUrl, apiKey, cookie, {
      onSuccess: handleReconnected,
      onFailure: handleReconnectFailed,
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  reconnect = (attempt = 1) => {
    const {
      rtcUrl,
      apiKey, cookie,
      handleReconnecting,
      handleReconnected,
      handleReconnectFailed,
    } = this.props;

    const backOff = attempt * attempt * 3000;

    if (attempt > 4) {
      handleReconnectFailed();
    }

    clearTimeout(this.lastTimeout);
    this.lastTimeout = setTimeout(() => {
      this.connect(rtcUrl, apiKey, cookie, {
        onStart: handleReconnecting,
        onSuccess: handleReconnected,
        // onFailure: handleReconnectFailed,
        attempt,
      });
    }, backOff);
  }

  /**
   * Create a websocket connection.
   * 
   * This will use the current token to get
   * a new token for connecting to the websocket.
   * 
   * These tokens are one-time use, so if the socket
   * need to reconnect, it is necessary to re-request
   * a socket token.
   */
  connect = (rtcUrl, apiKey, cookie, {
    onStart,
    onSuccess,
    onFailure,
    attempt,
  } = {}) => {
    const { authClient, getSocketToken } = this.props;
    if (onStart) onStart();
    this.socket = new Socket(rtcUrl, apiKey);

    authClient({ apiKey, cookie }).then(({ body }) => {
      const { token } = JSON.parse(body);
      return getSocketToken(token).then(({ body }) => {
        const b = body ? JSON.parse(body) : {};

        if (b.token) {
          this.socket.setReconnectCallback(this.reconnect);
          this.socket.connect(b.token);
          this.socket.registerCallback(handleEvent);

          if (onSuccess) onSuccess();
        } else {
          throw new Error('No token');
        }
      });
    }).catch(() => {
      if (onFailure) onFailure();
      const nextAttempt = attempt ? attempt + 1 : 1;

      this.reconnect(nextAttempt);
    });
  }

  render() {
    const { status } = this.props;

    return <SocketStatus status={status} />;
  }
}

export default connect(
  (state) => ({
    status: state.socket.status,
  }),
  {
    authClient,
    getSocketToken,
    connect,
    handleReconnecting: reconnecting,
    handleReconnected: reconnected,
    handleReconnectFailed: reconnectFailed,
  }
)(ChatSocket);

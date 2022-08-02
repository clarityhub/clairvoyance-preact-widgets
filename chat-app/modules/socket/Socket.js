import uuid from 'uuid/v4';
import io from 'socket.io-client';
import middleware from 'socketio-wildcard';

export let latestSocket = null;

export default class Socket {
  constructor(rtcUrl, apiKey) {
    this.rtcUrl = rtcUrl;
    this.socket = null;
    this.apiKey = apiKey;
    this.attemptReconnect = true;
    this.reconnect = () => { };
    this.callbacks = [];

    this.connect = this._connect.bind(this);
    this.registerCallback = this._registerCallback.bind(this);

    latestSocket = this;
  }

  _connect(token) {
    const url = new URL(this.rtcUrl);
    this.socket = io(url.origin, {
      path: url.pathname + '/socket.io',
      // We'll take care of reconnecting since the websocket must be authenticated
      reconnection: false,
      query: {
        token,
        device: 'widget' + uuid(),
      },
    });

    this.socket.on('disconnect', () => {
      if (this.attemptReconnect) {
        // Trigger reconnection
        this.reconnect();
      }
    });

    const patch = middleware(io.Manager);
    patch(this.socket);

    this.socket.on('*', (event) => {
      this.callbacks.forEach(c => c(event));
    });
  }

  setReconnectCallback(func) {
    this.reconnect = func;
  }

  close() {
    if (this.socket) {
      this.attemptReconnect = false;
      this.socket.disconnect();
    }
  }

  _registerCallback(callback) {
    this.callbacks.push(callback);
  }
}

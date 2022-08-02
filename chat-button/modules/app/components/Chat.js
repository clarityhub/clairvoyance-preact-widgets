import React, { Component } from 'react';
import { connect } from 'react-redux';

import { chat } from './Chat.scss';
import { closeChat, newMessage } from '../actions';

class Chat extends Component {
  componentDidMount() {
    window.addEventListener('message', this.onMessage, false);
  }

  // XXX unmount listeners

  onMessage = (event) => {
    const { newMessage, closeChat } = this.props;
    if (event.data && event.data.domain === 'clarityhub') {
      switch (event.data.type) {
        case 'CLOSE_CHAT':
          return closeChat();
        case 'NEW_MESSAGE':
          return newMessage();
        default:
      }
    }
  }

  render() {
    const { apiKey, widgetsUrl } = this.props;
    return (
      <iframe
        className={chat}
        src={`${widgetsUrl}/chat/index.html?API_KEY=${apiKey}`}
      />
    );
  }
}

export default connect(
  null,
  {
    closeChat,
    newMessage,
  }
)(Chat);

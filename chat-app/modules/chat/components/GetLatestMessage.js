import { Component } from 'react';
import { connect } from 'react-redux';
import { func, string } from 'prop-types';

class GetLatestMessage extends Component {
  static propTypes = {
    chatUuid: string.isRequired,
    children: func.isRequired,
    text: string,
    uuid: string,
  }

  componentDidMount() {
    // XXX If we are missing any messages from the store,
    // we need to ask for them
  }

  render() {
    const { children, text, uuid } = this.props;

    if (uuid) {
      return children({ text, uuid });
    } else {
      // TODO support a loader in props
      return null;
    }
  }
}

export default connect(
  (state, props) => {
    const messages = state.messages.items[props.chatUuid];

    if (messages && messages.length > 0) {
      const message = messages[messages.length - 1];
      return {
        text: message.text,
        uuid: message.uuid,
      };
    }

    return {};
  }
)(GetLatestMessage);

import { Component } from 'react';
import { connect } from 'react-redux';
import { arrayOf, func, shape, string } from 'prop-types';

/**

```
<GetChatParticipantClient participants={chat.participants}>
  (participant) => (<div>{participant.name}</div>)
</GetChatParticipantClient>
```
 */
class GetChatParticipantClient extends Component {
  static propTypes = {
    children: func.isRequired,
    mappedParticipants: arrayOf(shape({
      uuid: string,
      name: string,
      email: string,
    })),
    participants: arrayOf(string),
  }

  componentDidMount() {
    // XXX If we are missing any participants from the store,
    // we need to ask for them
  }

  render() {
    const { children, mappedParticipants } = this.props;
    const participant = mappedParticipants.find((p) => p.realType === 'client');

    if (participant) {
      return children(participant);
    } else {
      // TODO support a loader in props
      return null;
    }
  }
}

export default connect(
  (state, props) => ({
    mappedParticipants: props.participants.map((uuid) => state.participants.items[uuid]),
  })
)(GetChatParticipantClient);

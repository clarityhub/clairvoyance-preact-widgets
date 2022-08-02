import React from 'react';
import { connect } from 'react-redux';

import MessageGroups from '../../chat/components/messages/MessageGroups';

const ChatView = ({ uuid }) => (
  <div>
    <MessageGroups chatUuid={uuid} />
  </div>
);

export default connect(
  (state) => ({
    uuid: state.chats.currentUuid,
  }),
  {}
)(ChatView);

import React from 'react';
import { connect } from 'react-redux';

import { openChat } from '../actions';
import OpenButton from './OpenButton';

// TODO pull app data from server
const OpenButtonContainer = ({ openChat }) => (
  <button onClick={openChat}><OpenButton /></button>
);

export default connect(
  null,
  {
    openChat,
  }
)(OpenButtonContainer);

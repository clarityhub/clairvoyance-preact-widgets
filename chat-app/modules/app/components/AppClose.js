import React from 'react';
import { connect } from 'react-redux';
import { closeChat } from '../actions';
import Close from '../../icons/Close';

const AppClose = ({ closeChat }) => (
  <button id="widget-chat-container__close" onClick={closeChat}>
    <Close />
  </button>
);

export default connect(
  () => ({}),
  { closeChat }
)(AppClose);

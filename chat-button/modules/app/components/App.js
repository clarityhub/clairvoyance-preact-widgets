import React from 'react';
import { connect } from 'react-redux';

import OnFocus from '../../window/components/OnFocus';
import Title from '../../window/components/Title';
import Chat from './Chat';
import OpenButtonContainer from './OpenButtonContainer';
import { app } from './App.scss';

const App = ({ apiKey, widgetsUrl, isOpen, unread }) => (
  <div className={app}>
    <Title unread={unread} />
    <OnFocus />
    <OpenButtonContainer />
    {
      isOpen
        ? <Chat apiKey={apiKey} widgetsUrl={widgetsUrl} isOpen={isOpen} />
        : null
    }
  </div>
);

export default connect(
  (state) => ({
    isOpen: state.app.isOpen,
    unread: state.app.unread,
  })
)(App);

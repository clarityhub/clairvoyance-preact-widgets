import React from 'react';
import { connect } from 'react-redux';

import Socket from '../../socket/components/Socket';
import AppView from './AppView';
import { app } from './App.scss';

export default ({ apiKey, cookie, rtcUrl, openChat }) => (
  <div className={app}>
    <Socket
      apiKey={apiKey}
      cookie={cookie}
      rtcUrl={rtcUrl}
    />

    <AppView />
  </div>
);

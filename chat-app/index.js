import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Session from './Session';
import App from './modules/app/components/App';
import { configureStore } from './store';
import getApiKey from './getApiKey';
import './index.scss';

const API_KEY = getApiKey();
const DOMAIN = process.env.REACT_APP_APP_URL;
const RTC_URL = process.env.REACT_APP_RTC_URL;

const session = new Session(API_KEY);

ReactDOM.render(
  <Provider store={configureStore(API_KEY)}>
    <App
      cookie={session.cookie}
      apiKey={API_KEY}
      domain={DOMAIN}
      rtcUrl={RTC_URL}
    />
  </Provider>,
  document.getElementById('clarityhub-apps-chat')
);

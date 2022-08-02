import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import App from './modules/app/components/App';
import getApiKey from './getApiKey';

const API_KEY = getApiKey();
const WIDGETS_URL = process.env.REACT_APP_WIDGETS_URL;

/* LOAD STYLESHEET FOR PRODUCTION */
const link = document.createElement('link');
link.href = `${process.env.REACT_APP_WIDGETS_URL}/chat.css`;
link.type = 'text/css';
link.rel = 'stylesheet';
link.media = 'screen,print';
document.getElementsByTagName('head')[0].appendChild(link);

/* LOAD BUGSNAG */
const script = document.createElement('script');
script.src = '//d2wy8f7a9ursnm.cloudfront.net/bugsnag-3.min.js';
script['data-apikey'] = '661e0f76551fdf16c733412edb2a5079';
document.getElementsByTagName('head')[0].appendChild(script);
const container = document.createElement('div');
container.id = 'clarityhub-apps-chat';

document.body.appendChild(container);

ReactDOM.render(
  <Provider store={store}>
    <App
      apiKey={API_KEY}
      widgetsUrl={WIDGETS_URL}
    />
  </Provider>,
  container
);

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { StripeProvider } from 'react-stripe-elements';
import Flint from './utilities/flint';
import { store } from './store';

import RegistrationFlow from './react/RegistrationFlow';
import { getPlans } from './actions/plans';

import './styles/global.scss';
import './styles/inputs.scss';

const AUTH_URL = process.env.REACT_APP_AUTH_URL;
const API_URL = process.env.REACT_APP_API_URL;
const STRIPE_KEY = process.env.REACT_APP_STRIPE_KEY;

/* LOAD STYLESHEET FOR PRODUCTION */
const link = document.createElement('link');
link.href = `${process.env.REACT_APP_WIDGETS_URL}/reg.css`;
link.type = 'text/css';
link.rel = 'stylesheet';
link.media = 'screen,print';
document.getElementsByTagName('head')[0].appendChild(link);

/* LOAD BUGSNAG */
const script = document.createElement('script');
script.src = '//d2wy8f7a9ursnm.cloudfront.net/bugsnag-3.min.js';
script['data-apikey'] = '661e0f76551fdf16c733412edb2a5079';
document.getElementsByTagName('head')[0].appendChild(script);

Flint(() => {
  const p = new Promise((resolve, reject) => {
    getPlans((resp, body) => {
      resolve(JSON.parse(body));
    }, () => {
      // Failure
      resolve({
        // XXX hardcoded plans
        // free: {

        // },
        // 'silver-monthly':
      });
    });
  });

  p.then((plans) => {
    ReactDOM.render(
      <StripeProvider apiKey={STRIPE_KEY}>
        <Provider store={store}>
          <div className="registration-flow">
            <RegistrationFlow
              authUrl={AUTH_URL}
              apiUrl={API_URL}
              plans={plans}
            />
          </div>
        </Provider>
      </StripeProvider>,
      document.getElementById('clarityhub-apps-reg')
    );
  });
}, 'Stripe');

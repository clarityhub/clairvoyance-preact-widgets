import xhr from 'xhr';
import { store } from '../store';

export const requestRegistration = (success, failure) => {
  const state = store.getState();
  const { account, billing, user, invites } = state;

  xhr({
    method: 'post',
    body: JSON.stringify({
      account,
      billing,
      invites,
      user,
    }),
    // TODO not ideal, we should inject this in from main
    url: `${process.env.REACT_APP_API_URL}/accounts/register`,
    headers: {
      'Content-Type': 'application/json',
    },
  }, (err, resp, body) => {
    if (err || resp.statusCode >= 400) {
      failure(err, resp);
    } else {
      success(resp, body);
    }
  });
};

export const checkAvailable = (email, yes, no) => {
  xhr({
    method: 'post',
    body: JSON.stringify({
      email,
    }),
    // TODO not ideal, we should inject this in from main
    url: `${process.env.REACT_APP_API_URL}/accounts/email/available`,
    headers: {
      'Content-Type': 'application/json',
    },
  }, (err, resp, body) => {
    if (err || resp.statusCode >= 400) {
      no();
    } else {
      const available = JSON.parse(body).available;
      available ? yes() : no();
    }
  });
};

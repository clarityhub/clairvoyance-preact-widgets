import xhr from 'xhr';
import {
  SOCKET_TOKEN,
  RECONNECTING,
  RECONNECTED,
  RECONNECT_FAILED,
} from '../constants';

export const reconnecting = () => ({
  type: RECONNECTING,
});

export const reconnected = () => ({
  type: RECONNECTED,
});

export const reconnectFailed = () => ({
  type: RECONNECT_FAILED,
});

export const getSocketToken = (jwt) => {
  return (dispatch, getState, { paths }) => {
    return new Promise((resolve, reject) => {
      xhr({
        method: 'post',
        body: '',
        url: `${paths.rtc}/tokens`,
        headers: {
          'Content-Type': 'application/json',
          token: jwt,
        },
      }, (err, response, body) => {
        if (err) {
          reject(new Error({ err, response }));
        } else {
          dispatch({
            type: SOCKET_TOKEN,
            payload: JSON.parse(body),
          });
          resolve({ response, body });
        }
      });
    });
  };
};

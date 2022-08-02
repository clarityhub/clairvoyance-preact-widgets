import xhr from 'xhr';
import {
  SET_JWT,
} from '../constants';

export const authClient = (data) => {
  return (dispatch, getState, { paths }) => {
    return new Promise((resolve, reject) => {
      xhr({
        method: 'post',
        body: JSON.stringify(data),
        url: `${paths.auth}/client`,
        headers: {
          'Content-Type': 'application/json',
        },
      }, (err, response, body) => {
        if (err) {
          reject(new Error({ err, response }));
        } else {
          dispatch({
            type: SET_JWT,
            payload: JSON.parse(body),
          });
          resolve({ response, body });
        }
      });
    });
  };
};

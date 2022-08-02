import xhr from 'xhr';
import {
  UPDATE_CLIENT,
} from '../constants';

export const update = (data) => {
  return (dispatch, getState, { paths }) => {
    const token = getState().auth.token;

    return new Promise((resolve, reject) => {
      xhr({
        method: 'put',
        body: JSON.stringify(data),
        url: `${paths.api}/accounts/clients/me`,
        headers: {
          'Content-Type': 'application/json',
          token,
        },
      }, (err, response, body) => {
        if (err) {
          dispatch({
            type: UPDATE_CLIENT,
            payload: JSON.parse(body),
          });
          reject(new Error({ err, response }));
        } else {
          resolve({ response, body });
        }
      });
    });
  };
};

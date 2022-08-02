import {
  CREATE,
  READ,
  READ_ALL,
  FILTER,
  UPDATE,
} from '../constants';
import clarity from 'clarity/dist';

export const create = () => {
  return (dispatch, getState, { paths }) => {
    return clarity
      .with({
        dispatch,
        headers: {
          token: getState().auth.token,
        },
      })
      .post(`${paths.chat}`, {}, CREATE);
  };
};

export const getAll = () => {
  return (dispatch, getState, { paths }) => {
    const type = getState().chats.uiStatusFilter;

    let path = `${paths.chat}`;

    if (type) {
      // TODO add type in path
    }

    return clarity
      .with({
        dispatch,
        headers: {
          token: getState().auth.token,
        },
      })
      .passthrough({
        uiStatusFilter: type,
      })
      .get(path, {}, READ_ALL);
  };
};

export const get = (uuid) => {
  return (dispatch, getState, { paths }) => {
    return clarity
      .with({
        dispatch,
        headers: {
          token: getState().auth.token,
        },
      })
      .get(`${paths.chat}/${uuid}`, {}, READ);
  };
};

export const update = (uuid, { status }) => {
  return (dispatch, getState, { paths }) => {
    return clarity
      .with({
        dispatch,
        headers: {
          token: getState().auth.token,
        },
      })
      .passthrough({ uuid })
      .put(`${paths.chat}/${uuid}`, { status }, UPDATE);
  };
};

export const filter = (uiStatusFilter) => {
  return {
    type: FILTER,
    uiStatusFilter,
  };
};

export const resolve = (uuid) => {

};

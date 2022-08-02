import {
  RECONNECTING,
  RECONNECTED,
  RECONNECT_FAILED,
} from '../constants';

export default (state = {
  status: 'INITIAL',
}, action) => {
  switch (action.type) {
    case RECONNECTING:
      return {
        ...state,
        status: RECONNECTING,
      };
    case RECONNECTED:
      return {
        ...state,
        status: RECONNECTED,
      };
    case RECONNECT_FAILED:
      return {
        ...state,
        status: RECONNECT_FAILED,
      };
    default:
      return state;
  }
};

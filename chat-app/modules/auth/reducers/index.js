import {
  SET_JWT,
} from '../constants';

export default (state = {
  token: null,
}, action) => {
  switch (action.type) {
    case SET_JWT:
      return {
        ...state,
        token: action.payload.token,
      };
    default:
      return state;
  }
};

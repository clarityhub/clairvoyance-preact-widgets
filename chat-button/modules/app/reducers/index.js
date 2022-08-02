import {
  OPEN_CHAT,
  CLOSE_CHAT,
  NEW_MESSAGE,
  READ_MESSAGES,
} from '../constants';

export default (state = {
  isOpen: false,
  unread: 0,
}, action) => {
  switch (action.type) {
    case OPEN_CHAT:
      return { ...state, isOpen: true };
    case CLOSE_CHAT:
      return { ...state, isOpen: false };
    case NEW_MESSAGE:
      return { ...state, unread: state.unread + 1 };
    case READ_MESSAGES:
      return { ...state, unread: 0 };
    default:
      return state;
  }
};

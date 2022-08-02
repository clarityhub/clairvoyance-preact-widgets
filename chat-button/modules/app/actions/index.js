import { OPEN_CHAT, CLOSE_CHAT, NEW_MESSAGE, READ_MESSAGES } from '../constants';

export const openChat = () => {
  document.body.className += 'clarityhub__noScroll';

  return (dispatch) => {
    dispatch({
      type: OPEN_CHAT,
    });
  };
};

export const closeChat = () => {
  document.body.className = document.body.className.replace('clarityhub__noScroll', '');

  return (dispatch) => {
    dispatch({
      type: CLOSE_CHAT,
    });
  };
};

export const newMessage = () => {
  return (dispatch) => {
    if (!document.hasFocus()) {
      return dispatch({
        type: NEW_MESSAGE,
      });
    } else {
      return dispatch({
        type: 'DO_NOTHING',
      });
    }
  };
};

export const readMessages = () => ({
  type: READ_MESSAGES,
});

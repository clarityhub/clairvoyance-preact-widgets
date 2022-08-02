import store from '../../store';
import * as SOCKET from './constants';
import { incomingMessage } from '../chat/actions/messages';
import { latestSocket } from './Socket';

export const emitEvent = (event) => {
  if (latestSocket) {
    latestSocket.socket.emit(event.name, event.data);
  }
};

const timeouts = {};

export const handleEvent = (raw) => {
  const type = raw.data[1].event;
  const data = raw.data[1].meta;

  switch (type) {
    case SOCKET.CHAT_CREATED:
      return store.dispatch({
        type: SOCKET.SOCKET_CHAT_CREATED,
        payload: data,
      });
    case SOCKET.PARTICIPANT_UPDATED:
      return store.dispatch({
        type: SOCKET.SOCKET_PARTICIPANT_UPDATED,
        payload: data,
      });
    case SOCKET.MESSAGE_CREATED:
      return store.dispatch(incomingMessage(data));
    case SOCKET.PARTICIPANT_JOINED:
      return store.dispatch({
        type: SOCKET.SOCKET_PARTICIPANT_JOINED,
        payload: data,
      });
    case SOCKET.PARTICIPANT_TYPING:
      clearTimeout(timeouts[data.uuid]);

      timeouts[data.uuid] = setTimeout(() => {
        store.dispatch({
          type: SOCKET.SOCKET_PARTICIPANT_TYPING_END,
          payload: data,
        });
      }, 15000);

      return store.dispatch({
        type: SOCKET.SOCKET_PARTICIPANT_TYPING,
        payload: data,
      });
    case SOCKET.PARTICIPANT_TYPING_END:
      clearTimeout(timeouts[data.uuid]);

      return store.dispatch({
        type: SOCKET.SOCKET_PARTICIPANT_TYPING_END,
        payload: data,
      });
    default:
      // Do nothing
  }
};

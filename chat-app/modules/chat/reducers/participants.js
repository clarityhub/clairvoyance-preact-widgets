import clarity from 'clarity/dist';
import {
  SOCKET_CHAT_CREATED,
  SOCKET_PARTICIPANT_UPDATED,
  SOCKET_PARTICIPANT_JOINED,
} from '../../socket/constants';
import {
  CREATE as CHATS_CREATE,
  READ as CHATS_READ,
  READ_ALL as CHATS_READ_ALL,
} from '../constants';

export default clarity
  .listen([
    CHATS_CREATE,
    CHATS_READ,
    CHATS_READ_ALL,
    SOCKET_CHAT_CREATED,
    SOCKET_PARTICIPANT_UPDATED,
    SOCKET_PARTICIPANT_JOINED,
  ])
  .initial({
    items: {},
  })
  .onUpdate((state, action) => {
    switch (action.type) {
      case CHATS_CREATE:
        return {
          items: {
            ...state.items,
            ...action.payload.participants.map(p => {
              return {
                [p.uuid]: p,
              };
            }).reduce((a, b) => {
              return {
                ...a,
                ...b,
              };
            }, {}),
          },
        };

      case CHATS_READ_ALL:
        return {
          items: {
            ...state.items,
            // TODO there has to be a way to simplify this
            ...action.payload.chats.map(c => c.participants.map((p) => {
              return {
                [p.uuid]: p,
              };
            }).reduce((a, b) => {
              return {
                ...a,
                ...b,
              };
            }, {})).reduce((a, b) => {
              return {
                ...a,
                ...b,
              };
            }, {}),
          },
        };

      case CHATS_READ:
      case SOCKET_CHAT_CREATED:
        return {
          items: {
            ...state.items,
            ...action.payload.participants.reduce((r, p) => {
              r[p.uuid] = p;
              return r;
            }, {}),
          },
        };

      case SOCKET_PARTICIPANT_JOINED:
        return {
          items: {
            ...state.items,
            [action.payload.uuid]: action.payload,
          },
        };

      case SOCKET_PARTICIPANT_UPDATED:
        return {
          items: {
            ...state.items,
            [action.payload.uuid]: action.payload,
          },
        };

      default:
        return {};
    }
  });

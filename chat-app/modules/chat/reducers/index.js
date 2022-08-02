import clarity from 'clarity/dist';
import {
  CREATE,
  READ,
  READ_ALL,
  UPDATE,
} from '../constants';
import {
  READ_PAGE as MESSAGES_READ_PAGE,
} from '../constants/messages';
import {
  SOCKET_CHAT_CREATED,
} from '../../socket/constants';

// XXX ADD READ_PAGE to CHAT reducer and look for paging stuff

export default clarity
  .listen([
    CREATE,
    READ,
    READ_ALL,
    UPDATE,
    SOCKET_CHAT_CREATED,
  ])
  .initial({
    currentUuid: null,
    items: {},
  })
  .onUpdate((state, action) => {
    switch (action.type) {
      case MESSAGES_READ_PAGE:
        return {
          items: {
            ...state.items,
            [action.payload.chat.uuid]: {
              ...state.items[action.payload.chat.uuid],
              hasNextPage: action.payload.hasNextPage,
            },
          },
        };

      case CREATE:
        return {
          currentUuid: action.payload.uuid,
          items: {
            ...state.items,
            [action.payload.uuid]: {
              ...action.payload,
              // Normalize participants
              participants: action.payload.participants.map((p) => p.uuid),
            },

          },
        };
      case READ:
      case SOCKET_CHAT_CREATED:
        return {
          items: {
            ...state.items,
            [action.payload.uuid]: {
              ...action.payload,
              // Normalize participants
              participants: action.payload.participants.map((p) => p.uuid),
              // TODO set typing to false
            },

          },
        };

      case READ_ALL:
        return {
          items: {
            ...state.items,
            ...action.payload.chats.reduce((r, chat) => {
              r[chat.uuid] = {
                ...chat,
                // Normalize participants
                participants: chat.participants.map((p) => p.uuid),
              };
              return r;
            }, {}),
          },
        };

      case UPDATE:
        return {
          items: {
            ...state.items,
            [action.payload.uuid]: {
              ...state.items[action.payload.uuid],
              ...action.payload,
            },
          },
        };

      default:
        return {};
    }
  });

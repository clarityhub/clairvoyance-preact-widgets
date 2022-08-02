import clarity from 'clarity/dist';
import {
  READ_ALL as CHATS_READ_ALL,
} from '../constants';
import {
  CREATE,
  READ_PAGE,
} from '../constants/messages';
import {
  SOCKET_MESSAGE_CREATED,
  SOCKET_PARTICIPANT_TYPING,
  SOCKET_PARTICIPANT_TYPING_END,
} from '../../socket/constants';

// sort by date
const merge = (newMessages, messages = []) => {
  const trulyNew = newMessages.filter(newMessage => {
    return !messages.find(message => message.uuid === newMessage.uuid);
  });

  return messages.concat(trulyNew).sort((a, b) => {
    return a.createdAt.localeCompare(b.createdAt);
  });
};

const removeTypingMessages = (messages = []) => {
  return messages.filter(m => !m.typing);
};

export default clarity
  .listen([
    CHATS_READ_ALL,
    SOCKET_MESSAGE_CREATED,
    READ_PAGE,
    CREATE,
    SOCKET_PARTICIPANT_TYPING,
    SOCKET_PARTICIPANT_TYPING_END,
  ])
  .initial({
    items: {},
  })
  .onUpdate((state, action) => {
    switch (action.type) {
      case CHATS_READ_ALL:
        return {
          items: {
            ...state.items,
            ...action.payload.chats.map((r, c) => {
              if (c.latestMessage) {
                r[c.uuid] = merge([{
                  ...c.latestMessage,
                  participant: c.participants.find(p => p.uuid === c.latestMessage.participantId),
                }], state.items[c.uuid]);
              }
              return r;
            }, {}),
          },
        };
      case READ_PAGE:
        return {
          items: {
            ...state.items,
            [action.payload.chat.uuid]: merge(
              action.payload.messages,
              state.items[action.payload.chat.uuid]
            ),
          },
        };

      case CREATE:
        return {
          items: {
            ...state.items,
            [action.chatUuid]: merge(
              [Object.assign(
                {},
                action.payload,
                {
                  participantId: action.participant.uuid,
                }
              )], state.items[action.chatUuid] || []
            ),
          },
        };

      case SOCKET_MESSAGE_CREATED:
        return {
          items: {
            ...state.items,
            [action.payload.chatUuid]: merge([action.payload], state.items[action.payload.chatUuid]),
          },
        };

      case SOCKET_PARTICIPANT_TYPING:
        const chatMessages = removeTypingMessages((state.items[action.payload.uuid] || []).concat());
        const { uuid, ...rest } = action.payload;
        chatMessages.push({
          typing: true,
          participantId: rest.participant.uuid,
          ...rest,
        });
        return {
          items: {
            ...state.items,
            [action.payload.uuid]: chatMessages,
          },
        };

      case SOCKET_PARTICIPANT_TYPING_END:
        const roomMessages = removeTypingMessages((state.items[action.payload.uuid] || []).concat());

        return {
          items: {
            ...state.items,
            [action.payload.uuid]: roomMessages,
          },
        };

      default:
        return {};
    }
  });

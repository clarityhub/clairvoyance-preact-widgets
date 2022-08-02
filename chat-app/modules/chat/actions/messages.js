import uuidv4 from 'uuid/v4';

import {
  CREATE,
  READ_PAGE,
} from '../constants/messages';
import * as SOCKET from '../../socket/constants';

import clarity from 'clarity/dist';

export const getPage = (chatUuid, fromDate) => {
  return (dispatch, getState, { paths }) => {
    let path = `${paths.chat}/${chatUuid}/msgs`;

    if (fromDate) {
      path += `?fromDate=${fromDate}`;
    }

    return clarity
      .with({
        dispatch,
        headers: {
          token: getState().auth.token,
        },
      })
      .passthrough({
        fromDate,
      })
      .get(path, {}, READ_PAGE);
  };
};

export const create = (chatUuid, text) => {
  return (dispatch, getState, { paths }) => {
    const path = `${paths.chat}/${chatUuid}/msgs`;

    const participant = getState().me.item;
    return clarity
      .with({
        dispatch,
        headers: {
          token: getState().auth.token,
        },
      })
      .passthrough({
        chatUuid,
        participant,
      })
      .post(path, { text }, CREATE);
  };
};

export const append = (chatUuid, data) => {
  return {
    type: CREATE,
    payload: {
      ...data,
      uuid: uuidv4(),
      createdAt: new Date().toISOString(),
    },
    chatUuid,
    participant: {
      uuid: data.participantId,
    },
  };
};

export const incomingMessage = (data) => {
  return (dispatch, getState, { chatSounds }) => {
    const state = getState();

    const chatExists = Boolean(state.messages.items[data.chatUuid]);
    const isMe = chatExists && state.participants.items[data.participantId] && state.participants.items[data.participantId].realUuid === state.me.item.realUuid;

    if (!isMe) {
      chatSounds.ping.play();
      window.parent.postMessage({
        type: 'NEW_MESSAGE',
        domain: 'clarityhub',
      }, '*');
    }

    dispatch({
      type: SOCKET.SOCKET_MESSAGE_CREATED,
      payload: data,
    });
  };
};

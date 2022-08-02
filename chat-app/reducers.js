import { combineReducers } from 'redux';

import auth from './modules/auth/reducers';
import chats from './modules/chat/reducers';
import participants from './modules/chat/reducers/participants';
import messages from './modules/chat/reducers/messages';
import me from './modules/me/reducers';
import socket from './modules/socket/reducers';

export default combineReducers({
  auth,
  chats,
  me,
  participants,
  messages,
  socket,
});

import React from 'react';
import AppClose from './AppClose';
import ChatView from '../../chat/components/ChatView';
import ChatForm from '../../chat/components/chat-room/ChatRoomForm';

import { container, header, messages, form } from './AppView.scss';

export default () => (
  <div
    className={container}
  >
    <div className={header}>
      <AppClose />

    </div>
    <div className={messages}>
      <ChatView />

    </div>

    <div className={form}>
      <ChatForm />
    </div>
  </div>
);

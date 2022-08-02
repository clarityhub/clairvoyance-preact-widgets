import React from 'react';
import Messages from 'theme-claire/src/molecules/Messages';

import { BOT_AVATAR, BOT_PARTICIPANT } from '../../constants';
import AvatarUrl from './AvatarUrl';
import { avatarOther } from './BotQuestion.scss';

export default () => (
  <Messages
    groups={[
      {
        messages: [{
          uuid: '11919191',
          isSelf: false,
          text: `Hey there!


Feel free to ask us a question. I'll connect you with someone who can answer it!
`,
          participant: {
            ...BOT_PARTICIPANT,
            isSelf: false,
          },
        }],
        participant: {
          ...BOT_PARTICIPANT,
        },
      },
    ]}
    Avatar={() => (
      <div className={avatarOther}>
        <AvatarUrl url={BOT_AVATAR} />
      </div>
    )}
  />
);

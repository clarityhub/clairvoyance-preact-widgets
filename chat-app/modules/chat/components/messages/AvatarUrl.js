import React from 'react';

import { DEFAULT_AVATAR_URL } from '../../constants';
import { avatar } from './AvatarUrl.scss';

export default ({ name, url }) => (
  <img
    className={avatar}
    src={url || DEFAULT_AVATAR_URL}
    alt={name ? `${name}'s avatar'` : `A user's avatar`}
  />
);

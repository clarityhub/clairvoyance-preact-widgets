export const READ = 'CHATS_READ';
export const READ_ALL = 'CHATS_READ_ALL';
export const FILTER = 'CHATS_FILTER';
export const UPDATE = 'CHATS_UPDATE';
export const CREATE = 'CHATS_CREATE';

// export const DEFAULT_AVATAR_URL = '/avatar-placeholder.png';
export const DEFAULT_AVATAR_URL = `${process.env.REACT_APP_WIDGETS_URL}/avatar-placeholder.png`;
export const BOT_AVATAR = `${process.env.REACT_APP_WIDGETS_URL}/robot.png`;
export const BOT_PARTICIPANT = {
  uuid: -1,
  name: 'Claire the Owl',
  realType: 'user',
  realId: '-1',
  avatarUrl: BOT_AVATAR,
};

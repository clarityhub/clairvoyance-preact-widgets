import uuid from 'uuid/v4';

const setCookie = (cName, cValue, exDays = 30) => {
  const d = new Date();

  d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cName}=${cValue};${expires};path=/`;
};

const getCookie = (cName) => {
  const name = `${cName}=`;
  if (document.cookie) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }

    return null;
  } else {
    return null;
  }
};

export default class Session {
  constructor(apiKey) {
    const cookie = getCookie(`clair-${apiKey}`);

    if (cookie) {
      this.cookie = cookie;
    } else {
      const id = uuid();
      setCookie(`clair-${apiKey}`, id);
      this.cookie = id;
    }
  }
}

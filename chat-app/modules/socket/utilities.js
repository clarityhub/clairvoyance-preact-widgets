import { THROTTLE_DELAY } from './constants';

let requests = [];
let requestTimer;

const startTimer = () => {
  requestTimer = setTimeout(() => {
    const lastRequest = requests.pop();
    lastRequest.fn.call(null, lastRequest.data);
    requests = [];
    clearTimeout(requestTimer);
  }, THROTTLE_DELAY);
};

export const throttle = (fn, data, cancelFlag = null) => {
  if (data.name === cancelFlag) {
    clearTimeout(requestTimer);
    requests = [];
    fn.call(this, data);
  } else if (requests.length === 0) {
    fn.call(this, data);
    requests.push({ fn: () => { }, data: {} });
    startTimer();
  } else {
    requests.push({ fn, data });
  }
};

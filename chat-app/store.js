import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import chatSounds from './modules/chat/services/sounds';
import {
  autoRehydrate,
  persistStore,
} from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import createActionBuffer from 'redux-action-buffer';

const RTC_URL = process.env.REACT_APP_RTC_URL;
const AUTH_URL = process.env.REACT_APP_AUTH_URL;
const API_URL = process.env.REACT_APP_API_URL;

const middleware = applyMiddleware(thunk.withExtraArgument({
  paths: {
    api: API_URL,
    auth: AUTH_URL,
    rtc: RTC_URL,
    chat: API_URL + '/chats',
  },
  chatSounds,
}));

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  undefined,
  composeEnhancers(
    middleware,
    autoRehydrate(),
    applyMiddleware(
      createActionBuffer(REHYDRATE),
    ),
  ),
);

export default store;
export const configureStore = (apiKey) => {
  persistStore(store, {
    keyPrefix: `clair-${apiKey}`,
  });

  return store;
};

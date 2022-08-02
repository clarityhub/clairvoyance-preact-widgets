import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { REHYDRATE } from 'redux-persist/constants';
import {
  autoRehydrate,
  persistStore,
} from 'redux-persist';
import createActionBuffer from 'redux-action-buffer';

import reducers from './reducers';

const API_URL = process.env.REACT_APP_API_URL;

const middleware = applyMiddleware(thunk.withExtraArgument({
  paths: {
    api: API_URL,
  },
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

persistStore(store, {
  keyPrefix: 'clairChatWidget',
});

export default store;

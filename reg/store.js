import { createStore } from 'redux';

const store = createStore((state = {
  currentStep: 0,
  invites: [],
  appState: {},
  billing: {
    plan: 'standard',
  },
}, action) => {
  switch (action.type) {
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.step,
      };
    case 'SET_DATA':
      return {
        ...state,
        ...action.data,
      };
    case 'ADD_INVITE':
      return {
        ...state,
        invites: [...state.invites, action.data],
      };
    case 'REMOVE_INVITE':
      return {
        ...state,
        invites: state.invites.filter(invite => invite.email !== action.data),
      };
    case 'SAVE_PAGE_STATE':
      return {
        ...state,
        appState: {
          ...state.appState,
          [`${action.page}`]: action.state,
        },
      };
    default: return state;
  }
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export { store };

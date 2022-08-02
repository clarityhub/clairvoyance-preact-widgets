import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';
import {
  RECONNECTING,
  RECONNECTED,
  RECONNECT_FAILED,
} from '../constants';
import { popUp, popUpAlert, popUpWarning } from './SocketStatus.scss';

const PopUp = ({ children, alert, warning }) => (
  <div className={classnames(popUp, {
    [popUpAlert]: alert,
    [popUpWarning]: warning,
  })}>
    {children}
  </div>
);

export default ({ status }) => (
  <ReactCSSTransitionGroup
    transitionName="socketStatusSlide"
    transitionEnterTimeout={300}
    transitionLeaveTimeout={300}
  >
    {(() => {
      switch (status) {
        case RECONNECTING:
          return <PopUp warning key={RECONNECTING}>Reconnecting...</PopUp>;
        case RECONNECT_FAILED:
          return <PopUp alert key={RECONNECT_FAILED}>Internet connection lost</PopUp>;
        case 'INITIAL':
        case RECONNECTED:
        default:
          return null;
      }
    })()}
  </ReactCSSTransitionGroup>
);

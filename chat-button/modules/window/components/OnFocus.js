import { Component } from 'react';
import { connect } from 'react-redux';
import { readMessages } from '../../app/actions';

class OnFocus extends Component {
  componentDidMount() {
    window.addEventListener('focus', this.onchange);
    window.addEventListener('blur', this.onchange);
  }

  // XXX handle unmount

  onchange = (evt) => {
    const { isOpen, readMessages } = this.props;

    const hidden = 'hidden';
    const v = 'visible';
    const h = 'hidden';
    const evtMap = {
      focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h,
    };

    evt = evt || window.event;

    let state = 'hidden';
    if (evt.type in evtMap) {
      state = evtMap[evt.type];
    } else {
      state = this[hidden] ? 'hidden' : 'visible';
    }

    if (state === 'visible' && isOpen) {
      readMessages();
    }
  }

  render() {
    return null;
  }
}

export default connect(
  (state) => ({
    isOpen: state.app.isOpen,
  }),
  {
    readMessages,
  }
)(OnFocus);

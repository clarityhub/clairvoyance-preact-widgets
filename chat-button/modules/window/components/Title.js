import { Component } from 'react';

function getTitle() {
  if (document.title) {
    return document.title;
  } else {
    const els = document.getElementsByTagName('title');

    if (els.length > 0) {
      return els[0].innerHTML;
    }
  }

  return '';
}

export default class Title extends Component {
  originalTitle = getTitle();
  blinkTimer = null;

  componentWillReceiveProps(nextProps) {
    if (nextProps.unread !== this.props.unread) {
      clearInterval(this.blinkTimer);

      if (nextProps.unread === 0) {
        document.title = this.originalTitle;
      } else {
        let toggleClosure = false;
        document.title = `💬 (${nextProps.unread}) – ${this.originalTitle}`;
        this.blinkTimer = setInterval(() => {
          if (!toggleClosure) {
            document.title = this.originalTitle;
          } else {
            document.title = `💬 (${nextProps.unread}) – ${this.originalTitle}`;
          }

          toggleClosure = !toggleClosure;
        }, 1000);
      }
    }
  }

  render() {
    return null;
  }
}

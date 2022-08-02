import React, { Component } from 'react';
import { bool, func, string } from 'prop-types';
import { connect } from 'react-redux';
import { bind } from 'react-hocs';
import { branch, renderComponent } from 'recompose';
import deepEqual from 'deep-equal';
import { FETCHING } from 'clarity/dist/constants/state';
import Loading from 'theme-claire/src/atoms/Loading';
import Messages from 'theme-claire/src/molecules/Messages';
import { BOT_PARTICIPANT } from '../../constants';

import AvatarUrl from './AvatarUrl';
import BotQuestion from './BotQuestion';
import { avatarSelf, avatarOther, messages as messagesClass } from './MessageGroups.scss';

class MessageGroups extends Component {
  static propTypes = {
    chatUuid: string,
    onSubmitFormText: func.isRequired,
    onUpdateFormText: func.isRequired,
    typing: bool,
  }

  state = {
    groups: [],
  }

  isAtBottom = true;

  componentDidMount() {
    this.createGroups(this.props.messages);
    setTimeout(
      () => this.maybeScrollToBottom(true),
      0
    );

    this.container.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    this.container.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    const height = this.container.clientHeight;
    this.isAtBottom = this.container.scrollTop + this.container.scrollHeight >= height;
  }

  componentWillReceiveProps(newProps) {
    if (!deepEqual(newProps.messages, this.props.messages)) {
      this.createGroups(newProps.messages);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.messages.length !== this.props.messages.length) {
      this.maybeScrollToBottom();
    } else if (!prevProps.typing && this.props.typing) {
      this.maybeScrollToBottom();
    }
  }

  createGroups = (messages) => {
    const groups = [];

    let currentParticipantUuid = 0;

    messages.forEach((message) => {
      if (message.participantId === '-1') {
        message.participant = {
          uuid: '-1',
          realType: 'system',
        };
        message.system = true;
      }
      if (message.participant.uuid !== currentParticipantUuid) {
        // Create a new group
        groups.push({
          messages: [],
          participant: message.participant,
        });
        currentParticipantUuid = message.participant.uuid;
      }

      groups[groups.length - 1].messages.push(message);
    });

    this.setState({
      groups,
    });
  }

  maybeScrollToBottom = (force = false) => {
    if (!this.container) {
      return;
    }

    if (force || this.isAtBottom) {
      // We're going to the grandparent here
      // because that's the element that actually scrolls
      // NOT the container, unlike in webapp
      this.container.parentElement.parentElement.scrollTop = this.container.scrollHeight;
      this.isAtBottom = true;
    }
  }

  handleEditSuggestion = (data) => {
    this.props.onUpdateFormText(data.text);
  }

  handleSubmitSuggestion = (data) => {
    this.props.onSubmitFormText(data.text);
  }

  render() {
    const { groups } = this.state;

    return (
      <div className={messagesClass} ref={r => { this.container = r; }}>
        <BotQuestion />
        <Messages
          groups={groups}
          Avatar={({ isSelf, ...rest }) => (
            !isSelf
              ? <div className={isSelf ? avatarSelf : avatarOther}>
                <AvatarUrl {...rest} />
              </div>
              : null
          )}
        />
      </div>
    );
  }
}

const enhanceLoading = branch(
  props => props.state === FETCHING && props.messages.length === 0,
  renderComponent(() => (
    <div className={messagesClass}>
      <BotQuestion />
      <Loading />
    </div>
  ))
);

const annotate = (messages, participants, me) => {
  // Add the participant to the messages
  // Add if the participant is self
  return messages.map((message) => {
    let participant;

    if (message.participantId === 'claire-bot') {
      participant = BOT_PARTICIPANT;
    } else {
      participant = participants[message.participantId];
    }

    const isSelf = participant && participant.realType === 'client';

    message.participant = participant || {};
    message.participant.isSelf = isSelf;

    return message;
  });
};

export default bind(
  connect(
    (state, props) => {
      let messages = [];
      if (state.chats.items[props.chatUuid]) {
        messages = annotate(
          state.messages.items[props.chatUuid] || [],
          state.participants.items,
          state.me,
        );
      }

      return {
        messages,
        state: state.messages.state,
      };
    }
  )
)(enhanceLoading(MessageGroups));

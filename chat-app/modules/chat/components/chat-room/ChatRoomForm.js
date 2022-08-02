import React, { Component } from 'react';
import { bool, func, string } from 'prop-types';
import { connect } from 'react-redux';
import FaPaperPlane from 'react-icons/lib/fa/paper-plane';
import Textarea from 'theme-claire/src/atoms/Textarea';

import { emitEvent } from '../../../socket/handler';
import { throttle } from '../../../socket/utilities';

import ClaireLifecycle from '../../../bots/ClaireLifecycle';
import { create as createChat } from '../../actions';
import { create, append } from '../../actions/messages';
import { update } from '../../../me/actions';

import {
  formContainer,
  form as formStyle,
  formTextArea,
  formSend,
} from './ChatRoomForm.scss';

class ChatRoomForm extends Component {
  static propTypes = {
    currentUuid: string,
    handleAppend: func.isRequired,
    handleCreate: func.isRequired,
    handleCreateChat: func.isRequired,
    handleUpdate: func.isRequired,
    handleUpdateClient: func.isRequired,
    isOpen: bool,
    uuid: string.isRequired,
  }

  state = {
    text: '',
  }

  componentDidMount() {
    if (this.text) {
      this.text.focus();
    }
  }

  handleSubmit = (e) => {
    e && e.preventDefault();

    const {
      handleUpdateClient,
      handleAppend,
      handleCreate,
      handleCreateChat,
      selfParticipant,
      uuid,
    } = this.props;
    const text = this.state.text;

    if (text.trim() === '') {
      this.setState({
        text: '',
      });
      return;
    }

    if (uuid) {
      if (this.botCallback) {
        this.botCallback(text);
        this.botCallback = null;

        handleAppend(uuid, {
          text: text,
          // add our own participant id
          participantId: selfParticipant.uuid,
        });
        this.setState({
          text: '',
        });
        return;
      }

      handleCreate(uuid, text);
      throttle(emitEvent, {
        name: 'chat-participant.typing-end',
        data: {
          event: 'chat-participant.typing-end',
          ts: +new Date(),
          meta: {
            uuid,
            participantUuid: selfParticipant.uuid,
          },
        },
      }, 'chat-participant.typing-end');
    } else {
      const request = handleCreateChat();

      request.response.then(({ body }) => {
        handleCreate(body.uuid, text);
        throttle(emitEvent, {
          name: 'chat-participant.typing-end',
          data: {
            event: 'chat-participant.typing-end',
            ts: +new Date(),
            meta: {
              uuid,
            },
          },
        }, 'chat-participant.typing-end');

        if (this.props.selfParticipant &&
            this.props.selfParticipant.name &&
            this.props.selfParticipant.email) {
          // TODO simple bot response
          return;
        }

        this.bot = new ClaireLifecycle({
          onFinish: handleUpdateClient,
        });
        this.botDoStep = this.bot.doStep.bind(
          this.bot,
          (m) => {
            const { uuid } = this.props;
            handleAppend(uuid, {
              text: m,
              participantId: 'claire-bot',
            });
          },
          (afterResponse) => {
            // register this to callback when the user responds
            if (afterResponse) {
              this.botCallback = (...args) => {
                afterResponse(...args);
                setTimeout(this.botDoStep, 500);
              };
            } else {
              // mark the next step
              setTimeout(this.botDoStep, 500);
            }
          }
        );

        setTimeout(this.botDoStep, 500);
      });
    }

    this.setState({
      text: '',
    });
  }

  handleChange = (e) => {
    const { uuid, selfParticipant } = this.props;
    if (e.keyCode === 13 && !e.shiftKey) {
      return this.handleSubmit();
    }

    if (this.state.text && e.target.value === '') {
      throttle(emitEvent, {
        name: 'chat-participant.typing-end',
        data: {
          event: 'chat-participant.typing-end',
          ts: +new Date(),
          meta: {
            uuid,
            participantUuid: selfParticipant.uuid,
          },
        },
      }, 'chat-participant.typing-end');
    } else if (e.target.value !== '') {
      throttle(emitEvent, {
        name: 'chat-participant.typing',
        data: {
          event: 'chat-participant.typing',
          ts: +new Date(),
          meta: {
            uuid,
            participantUuid: selfParticipant.uuid,
            message: e.target.value,
          },
        },
      }, 'chat-participant.typing-end');
    }
    this.setState({text: e.target.value});
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e && e.preventDefault();
    }
  }

  render() {
    const { isOpen, uuid } = this.props;

    return (
      <div className={formContainer}>
        {
          isOpen || uuid === null
            ? <form className={formStyle} onSubmit={this.handleSubmit}>
              <Textarea
                className={formTextArea}
                // TODO textareRef is not really needed, but react-theme messed it up :(
                textareaRef={r => { this.text = r; }}
                value={this.state.text}
                onKeyUp={this.handleChange}
                onKeyDown={this.handleKeyDown}
                name="message"
              />
              <button id="widget-chat-container__send" type="submit" className={formSend}>
                <FaPaperPlane />
              </button>
            </form>
            : <span>Thank you!</span>
        }
      </div>
    );
  }
}

// No recompose here since we need the ref to ChatRoomForm
export default connect(
  (state) => {
    let isOpen = false;
    if (state.chats.currentUuid && state.chats.items[state.chats.currentUuid]) {
      isOpen = state.chats.items[state.chats.currentUuid].status === 'open';
    }

    return {
      uuid: state.chats.currentUuid,
      isOpen,
      selfParticipant: state.me.item,
    };
  },
  {
    handleAppend: append,
    handleCreate: create,
    handleCreateChat: createChat,
    handleUpdateClient: update,
  },
  null,
  { withRef: true }
)(ChatRoomForm);

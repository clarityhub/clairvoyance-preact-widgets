export const closeChat = () => {
  window.parent.postMessage({
    type: 'CLOSE_CHAT',
    domain: 'clarityhub',
  }, '*');

  return {
    type: 'CLOSE_CHAT',
  };
};

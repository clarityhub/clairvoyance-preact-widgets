import isEmail from 'isemail';

const waitUntilValid = (step) => {
  return {
    ...step,
    question: step.invalidResponse,
    parent: step,
  };
};

export default class ClaireLifecycle {
  steps = [
    {
      question: 'While we connect you with someone, can you tell me your name?',
      var: '%name%',
    },
    {
      message: 'Great, thanks %name%!',
    },
    {
      question: 'What\'s your email in case we get disconnected?',
      var: '%email%',
      validate: (val) => { return isEmail.validate(val) },
      invalidResponse: 'Please enter a valid email',
    },
    {
      message: 'Awesome! I\'ll pass your info along to our agents',
    },
  ]

  vars = {}

  // currentStep = 0
  node = null;

  constructor({ onFinish }) {
    this.onFinish = onFinish;
  }

  getStep = () => {
    if (this.node) {
      return this.node;
    } else {
      return this.steps[0];
    }
  }

  setStep = (node) => {
    this.node = node;
  }

  nextStep = (step) => {
    if (step.parent) {
      this.nextStep(step.parent);
    } else {
      const index = this.steps.findIndex(i => i === step);
      if (index !== -1 && index < this.steps.length - 1) {
        this.setStep(this.steps[index + 1]);
      } else {
        this.setStep('FINISHED');
      }
    }
  }

  doStep = (sendMessage, awaitResponse) => {
    if (this.getStep() === 'FINISHED') {
    // if (this.currentStep >= this.steps.length) {
      this.onFinish({
        name: this.vars['%name%'],
        email: this.vars['%email%'],
      });
      return;
    }

    const step = this.getStep(); // this.steps[this.currentStep];

    if (step.question) {
      sendMessage(this.format(step.question));
      awaitResponse((response) => {
        if (step.var) {
          if (step.validate) {
            if (!step.validate(response)) {
              this.setStep(waitUntilValid(step));
              return false;
            }
          }

          this.vars[step.var] = response;
        }
      });
    } else if (step.message) {
      sendMessage(this.format(step.message));
      awaitResponse(false);
    }

    // this.currentStep += 1;
    this.nextStep(step);
  }

  format = (text) => {
    let modifiedText = text;
    Object.keys(this.vars).forEach((needle) => {
      const replacement = this.vars[needle];
      modifiedText = modifiedText.replace(needle, replacement);
    });

    return modifiedText;
  }
}

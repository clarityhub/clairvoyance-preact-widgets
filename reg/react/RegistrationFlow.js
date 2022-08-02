import React, { Component } from 'react';
import { connect } from 'react-redux';
import { shape, number, func } from 'prop-types';
import FaEye from 'react-icons/lib/fa/eye';
import FaEyeSlash from 'react-icons/lib/fa/eye-slash';

import Loading from 'theme-claire/src/atoms/Loading';

import debounce from '../utilities/debounce';
import { requestRegistration, checkAvailable } from '../actions';

import { validateEmail, validatePassword } from '../utilities';
import Error from './Error';

const debounceCheckAvailable = debounce(checkAvailable, 1000);

class RegistrationFlow extends Component {
  static propTypes = {
    appState: shape({}),
    currentStep: number,
    handleSaveData: func,
    plans: shape({}),
  }

  state = {
    firstName: '',
    company: '',
    email: '',
    password: '',
    showPassword: false,
    errors: {},
    emailAvailable: true,
    loading: false,
    // error
  }

  handleRestart = () => {
    this.setState({
      loading: false,
    });
  }

  onSubmit = (e) => {
    e && e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.setState({
      loading: true,
    }, () => {
      this.props.handleSaveData({
        account: {
          name: this.state.company,
        },
        user: {
          name: this.state.firstName,
          password: this.state.password,
          email: this.state.email,
        },
      });

      requestRegistration((resp, body) => {
        // Success
        this.setState({
          error: null,
        });

        // Get back response
        // Get JWT
        const jwt = JSON.parse(body).jwt;
        // Store it in cookie storage
        document.cookie = `jwt=${jwt};domain=${process.env.REACT_APP_BASE_URL};path=/;max-age=${60 * 60}`;
        // redirect to login, use cookie
        window.location.href = `${process.env.REACT_APP_APP_URL}`;
      }, (err, resp) => {
        // Failure
        this.setState({
          error: err || JSON.parse(resp.body).reason,
        });
      });
    });
  }

  handleChangeInput = (type) => {
    return (event) => {
      if (type === 'email') {
        debounceCheckAvailable(event.target.value, () => {
          this.setState({
            emailAvailable: true,
            errors: {
              ...this.state.errors,
              email: null,
            },
          });
        }, () => {
          this.setState({
            errors: {
              ...this.state.errors,
              email: 'That email is taken',
            },
            emailAvailable: false,
          });
        });
      }

      this.setState({
        [type]: event.target.value,
      });
    };
  }

  validateForm = () => {
    const {
      firstName,
      company,
      email,
      password,
      emailAvailable,
    } = this.state;
    // Validate passwords
    const errors = {};

    if (firstName === '') {
      errors.firstName = 'You must provide a first name';
    } else if (errors.firstName) {
      delete errors.firstName;
    }

    if (company === '') {
      errors.company = 'You must provide a company name';
    } else if (errors.company) {
      delete errors.company;
    }

    const isEmailValid = validateEmail(email);
    if (!emailAvailable) {
      errors.email = 'That email is already taken';
    } else if (email === '' || !isEmailValid) {
      errors.email = 'You must provide a valid email';
    } else if (errors.email) {
      delete errors.email;
    }

    if (password === '') {
      errors.password = 'You must provide a password';
    } else if (!validatePassword(password)) {
      errors.password = 'Password must be at least 8 characters long with at least one letter and one number';
    } else if (errors.password) {
      delete errors.password;
    }

    this.setState({
      errors,
    });
    return Object.keys(errors).length === 0;
  }

  togglePassword = (e) => {
    e && e.preventDefault();

    this.setState({
      showPassword: !this.state.showPassword,
    });
  }

  renderUserInfo = () => {
    const { firstName, company, email, password, errors, showPassword } = this.state;
    return (
      <form className="user-info" onSubmit={this.onSubmit}>
        <h2>Get Started</h2>
        <div className="user-info__input-group">
          <div className="form-group form-group--controlled half-width">
            <Error show={Boolean(errors.company)} message={errors.company || ''} />
            <input
              type="text"
              name="company"
              value={company}
              onChange={this.handleChangeInput('company')}
              data-not-empty={company !== ''}
            />
            <label>Company</label>
          </div>
          <div className="form-group form-group--controlled half-width">
            <Error show={Boolean(errors.firstName)} message={errors.firstName || ''} />
            <input
              type="text"
              name="first_name"
              value={firstName}
              onChange={this.handleChangeInput('firstName')}
              data-not-empty={firstName !== ''}
            />
            <label>Your Name</label>
          </div>
          <div className="form-group form-group--controlled half-width">
            <Error show={Boolean(errors.email)} message={errors.email || ''} />
            <input
              type="text"
              name="email"
              value={email}
              onChange={this.handleChangeInput('email')}
              data-not-empty={email !== ''}
            />
            <label>Your Email</label>
          </div>
          <div className="form-group form-group--controlled half-width">
            <Error show={Boolean(errors.password)} message={errors.password || ''} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              name="password"
              onChange={this.handleChangeInput('password')}
              data-not-empty={password !== ''}
            />
            <label>Your Password</label>
            <button
              className="registration-flow__toggle-password"
              tabIndex="-1"
              onClick={this.togglePassword}
              type="button"
            >
              {
                showPassword
                  ? <FaEye />
                  : <FaEyeSlash />
              }
            </button>
          </div>
        </div>

        <div className="registration-flow__buttons">
          <button className="button--primary" type="submit">Get Started</button>
          <div className="registration-flow__small-text">
            <p>Start your 30-day free trial, no credit card required</p>
            <p>
              By registering, you agree to our <a href={`${process.env.REACT_APP_WWW_URL}/terms`} target="blank">Terms and Conditions</a>
            </p>
          </div>
        </div>

      </form>
    );
  }

  renderLoading = () => {
    // TODO
    return (
      <div className="registration-flow__loading">
        {
          this.state.error
            ? (
              <div className="registration-flow__error">
                <p>There was a problem proccesing your request:</p>
                <p>{this.state.error}</p>

                <button className="button--primary" onClick={this.handleRestart}>Go back and edit</button>
              </div>
            )
            : <Loading />
        }
      </div>
    );
  }

  render() {
    return this.state.loading
      ? this.renderLoading()
      : this.renderUserInfo();
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    plan: state.plan,
    appState: state.appState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSaveData: data => dispatch({
      type: 'SET_DATA',
      data,
    }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationFlow);

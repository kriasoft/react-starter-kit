import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  FormGroup,
  Button,
  ControlLabel,
  FormControl,
  HelpBlock,
  PageHeader,
} from 'react-bootstrap';
import s from './Login.css';

class Login extends React.Component {
  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  };

  state = {
    email: '',
    password: '',
  };

  getValidationState() {
    const { email } = this.state;
    if (!email.length) return null;
    if (/^[a-zA-Z0-9+.\-_]+@[a-zA-Z0-9+.\-_]+$/.test(email)) {
      return 'success';
    }
    return 'error';
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  render() {
    const { email, password } = this.state;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <PageHeader>Log in to NDO</PageHeader>
          <form action="/login" method="post">
            <FormGroup
              bsSize="large"
              controlId="email"
              validationState={this.getValidationState()}
            >
              <ControlLabel>Username or email address</ControlLabel>
              <FormControl
                required
                type="email"
                name="usernameOrEmail"
                autoFocus
                value={email}
                onChange={this.handleChange}
              />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup bsSize="large" controlId="password">
              <ControlLabel>Password</ControlLabel>
              <FormControl
                required
                minLength={6}
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
              <HelpBlock>Make sure it`s at least 6 characters.</HelpBlock>
            </FormGroup>
            <FormGroup>
              <Button bsSize="large" bsStyle="primary" type="submit" block>
                Log in
              </Button>
            </FormGroup>
            {/* <HelpBlock>
              Don`t have an account?
              <Button bsStyle="link" href="/register">
                Sign up
              </Button>
            </HelpBlock> */}
            <Button bsStyle="link" href="login/facebook" block>
              <svg
                className={s.icon}
                width="30"
                height="30"
                viewBox="0 0 30 30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22 16l1-5h-5V7c0-1.544.784-2 3-2h2V0h-4c-4.072 0-7 2.435-7 7v4H7v5h5v14h6V16h4z" />
              </svg>
              Log in with Facebook
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Login);

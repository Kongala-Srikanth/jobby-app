import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: ''}

  onEnterUsername = event =>
    this.setState({username: event.target.value, errorMsg: ''})

  onEnterPassword = event =>
    this.setState({password: event.target.value, errorMsg: ''})

  loginSuccessful = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    // this.setState({username: '', password: '', errorMsg: ''})
    history.replace('/')
  }

  loginFailure = errorMsg => {
    this.setState({username: '', password: '', errorMsg})
  }

  onSubmit = async event => {
    event.preventDefault()

    const {username, password} = this.state

    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.loginSuccessful(data.jwt_token)
    } else if (response.status === 400 || response.status === 404) {
      this.loginFailure(data.error_msg)
    }
  }

  render() {
    if (Cookies.get('jwt_token') !== undefined) {
      return <Redirect to="/" />
    }

    const {username, password, errorMsg} = this.state

    return (
      <div className="bg-container">
        <div className="login-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-page-logo"
          />
          <form onSubmit={this.onSubmit}>
            <label htmlFor="username" className="label-text">
              USERNAME
            </label>
            <br />
            <input
              type="text"
              id="username"
              className="input-login-box"
              placeholder="Username"
              onChange={this.onEnterUsername}
              value={username}
            />
            <br />

            <label htmlFor="password" className="label-text">
              PASSWORD
            </label>
            <br />
            <input
              type="password"
              id="password"
              className="input-login-box"
              placeholder="Password"
              onChange={this.onEnterPassword}
              value={password}
            />
            <br />
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          <p className="error-msg">{errorMsg}</p>
        </div>
      </div>
    )
  }
}

export default Login

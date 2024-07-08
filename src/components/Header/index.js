import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'

import {IoIosLogOut} from 'react-icons/io'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <ul className="nav-container">
      <Link to="/" className="link">
        <li>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </li>
      </Link>

      <li className="nav-icons-container">
        <Link to="/" className="link">
          <button type="button" className="hide-btn">
            <AiFillHome className="nav-icons" />
          </button>
        </Link>
        <Link to="/jobs" className="link">
          <button type="button" className="hide-btn">
            <BsBriefcaseFill className="nav-icons" />
          </button>
        </Link>

        <button type="button" className="hide-btn" onClick={onClickLogout}>
          <IoIosLogOut className="nav-icons" />
        </button>

        <Link to="/" className="link">
          <button type="button" className="hide-btn lg-nav-btn">
            Home
          </button>
        </Link>
        <Link to="/jobs" className="link">
          <button type="button" className="hide-btn lg-nav-btn">
            Jobs
          </button>
        </Link>
      </li>
      <li className="lg-nav-btn">
        <button type="button" className="logout-btn" onClick={onClickLogout}>
          Logout
        </button>
      </li>
    </ul>
  )
}

export default withRouter(Header)

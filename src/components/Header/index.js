import {Link, withRouter} from 'react-router-dom'
import {ImHome} from 'react-icons/im'
import {FiLogOut} from 'react-icons/fi'
import {FaBriefcase} from 'react-icons/fa'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-container">
      <ul className="nav-items">
        <li className="logo-container">
          <Link to="/" className="links">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="logo"
            />
          </Link>
        </li>
        <li className="home-jobs-container">
          <Link to="/" className="links">
            <ImHome className="icon" />
            <h1 className="nav-text">Home</h1>
          </Link>
          <Link to="/jobs" className="links">
            <FaBriefcase className="icon" />
            <h1 className="nav-text">Jobs</h1>
          </Link>
        </li>
        <li>
          <FiLogOut onClick={onClickLogout} className="icon" />
          <button type="button" onClick={onClickLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)

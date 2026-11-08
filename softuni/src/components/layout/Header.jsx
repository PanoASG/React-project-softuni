import { Link, NavLink, useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'
import { logout } from '../../services/authService.js'

const guestLinks = [
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
]

const userLinks = [
  { to: '/books/new', label: 'Add a review' },
  { to: '/my-reviews', label: 'My reviews' },
]

function Header() {
  const { isAuthenticated, isAuthLoading, username } = useAuth()
  const navigate = useNavigate()

  const logoutHandler = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      alert(error.message)
    }
  }

  const links = isAuthenticated ? userLinks : guestLinks

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__brand">
          Marginalia
        </Link>
        <nav className="header__nav" aria-label="Main navigation">
          <NavLink to="/books" end className="header__link">
            Catalog
          </NavLink>
          {!isAuthLoading &&
            links.map(({ to, label }) => (
              <NavLink key={to} to={to} end className="header__link">
                {label}
              </NavLink>
            ))}
          {isAuthenticated && (
            <>
              <span className="header__user">Hi, {username}</span>
              <button type="button" className="header__link header__logout" onClick={logoutHandler}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header

import { Link, NavLink } from 'react-router'

const navLinks = [
  { to: '/books', label: 'Catalog' },
  { to: '/books/new', label: 'Add a review' },
  { to: '/my-reviews', label: 'My reviews' },
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
]

function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__brand">
          Marginalia
        </Link>
        <nav className="header__nav" aria-label="Main navigation">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end className="header__link">
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header

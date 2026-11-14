import { Outlet, useLocation } from 'react-router'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import './Layout.css'

function Layout() {
  const location = useLocation()

  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout

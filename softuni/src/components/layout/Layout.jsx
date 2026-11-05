import { Outlet } from 'react-router'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import './Layout.css'

function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout

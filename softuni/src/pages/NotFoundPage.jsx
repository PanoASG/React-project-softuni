import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <section>
      <h1>Page not found</h1>
      <p className="page__intro">
        This page does not exist. <Link to="/books">Browse the catalog</Link> instead.
      </p>
    </section>
  )
}

export default NotFoundPage

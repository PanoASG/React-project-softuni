import { Link } from 'react-router'

function ReviewNotFound({ message }) {
  return (
    <section>
      <h1>Review not found</h1>
      <p className="page__intro">
        {message} <Link to="/books">Back to the catalog</Link>
      </p>
    </section>
  )
}

export default ReviewNotFound

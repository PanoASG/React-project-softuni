import { Link } from 'react-router'
import ErrorMessage from '../components/common/ErrorMessage.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import ReviewList from '../components/reviews/ReviewList.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { getLatestReviews } from '../services/reviewService.js'
import './HomePage.css'

function HomePage() {
  const { data: reviews, error, isLoading, retry } = useFetch(getLatestReviews)

  return (
    <>
      <section className="hero">
        <h1 className="hero__title">Find your next favourite book</h1>
        <p className="hero__text">Read honest reviews from fellow readers and share your own.</p>
      </section>

      <section className="latest" aria-labelledby="latest-title">
        <h2 id="latest-title">Latest reviews</h2>
        {isLoading && <LoadingSpinner text="Loading the latest reviews..." />}
        {error && <ErrorMessage message={error.message} onRetry={retry} />}
        {reviews && (
          <ReviewList reviews={reviews} emptyMessage="No reviews yet. Be the first to share one!" />
        )}
        <div className="latest__more">
          <Link to="/books" className="button">
            See all reviews
          </Link>
        </div>
      </section>
    </>
  )
}

export default HomePage

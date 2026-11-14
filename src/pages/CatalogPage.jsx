import ErrorMessage from '../components/common/ErrorMessage.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import ReviewList from '../components/reviews/ReviewList.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { getAllReviews } from '../services/reviewService.js'

function CatalogPage() {
  const { data: reviews, error, isLoading, retry } = useFetch(getAllReviews)

  return (
    <section>
      <h1>Book reviews</h1>
      {isLoading && <LoadingSpinner text="Loading reviews..." />}
      {error && <ErrorMessage message={error.message} onRetry={retry} />}
      {reviews && <ReviewList reviews={reviews} emptyMessage="No reviews yet. Be the first to add one!" />}
    </section>
  )
}

export default CatalogPage

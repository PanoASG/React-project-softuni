import { useCallback } from 'react'
import { Link } from 'react-router'
import ErrorMessage from '../components/common/ErrorMessage.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import ReviewList from '../components/reviews/ReviewList.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useFetch } from '../hooks/useFetch.js'
import { getReviewsByUser } from '../services/reviewService.js'

function MyReviewsPage() {
  const { user } = useAuth()
  const fetchMyReviews = useCallback(() => getReviewsByUser(user.id), [user.id])
  const { data: reviews, error, isLoading, retry } = useFetch(fetchMyReviews)

  return (
    <section>
      <div className="page__header">
        <h1>My reviews</h1>
        <Link to="/books/new" className="button">
          Add a review
        </Link>
      </div>
      {isLoading && <LoadingSpinner text="Loading your reviews..." />}
      {error && <ErrorMessage message={error.message} onRetry={retry} />}
      {reviews && <ReviewList reviews={reviews} emptyMessage="You have not written any reviews yet." />}
    </section>
  )
}

export default MyReviewsPage

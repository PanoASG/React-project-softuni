import { useCallback } from 'react'
import { Link, useParams } from 'react-router'
import ErrorMessage from '../components/common/ErrorMessage.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import BookCover from '../components/reviews/BookCover.jsx'
import StarRating from '../components/reviews/StarRating.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { getReviewById } from '../services/reviewService.js'
import { formatDate } from '../utils/formatDate.js'
import './BookDetailsPage.css'

function BookDetailsPage() {
  const { bookId } = useParams()
  const fetchReview = useCallback(() => getReviewById(bookId), [bookId])
  const { data: review, error, isLoading, retry } = useFetch(fetchReview)

  if (isLoading) {
    return <LoadingSpinner text="Loading review..." />
  }

  if (error?.notFound) {
    return (
      <section>
        <h1>Review not found</h1>
        <p className="page__intro">
          {error.message} <Link to="/books">Back to the catalog</Link>
        </p>
      </section>
    )
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={retry} />
  }

  return (
    <article className="details">
      <BookCover url={review.coverUrl} title={review.title} className="details__cover" />
      <div className="details__info">
        <h1 className="details__title">{review.title}</h1>
        <p className="details__author">by {review.author}</p>
        <StarRating rating={review.rating} />
        <p className="details__meta">
          {review.genre} · reviewed by {review.username} on {formatDate(review.createdAt)}
        </p>
        <p className="details__content">{review.content}</p>
        <Link to="/books">Back to the catalog</Link>
      </div>
    </article>
  )
}

export default BookDetailsPage

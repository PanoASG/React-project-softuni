import { Link } from 'react-router'
import BookCover from './BookCover.jsx'
import StarRating from './StarRating.jsx'

function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <Link to={`/books/${review.id}`} className="review-card__link">
        <BookCover url={review.coverUrl} title={review.title} className="review-card__cover" />
        <div className="review-card__body">
          <h2 className="review-card__title">{review.title}</h2>
          <p className="review-card__author">by {review.author}</p>
          <StarRating rating={review.rating} />
          <p className="review-card__meta">
            {review.genre} · reviewed by {review.username}
          </p>
        </div>
      </Link>
    </article>
  )
}

export default ReviewCard

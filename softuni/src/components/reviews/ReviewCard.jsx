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
          <p className="review-card__stats">
            <span aria-hidden="true">♥</span> {review.likeCount} {review.likeCount === 1 ? 'like' : 'likes'} ·{' '}
            {review.commentCount} {review.commentCount === 1 ? 'comment' : 'comments'}
          </p>
        </div>
      </Link>
    </article>
  )
}

export default ReviewCard

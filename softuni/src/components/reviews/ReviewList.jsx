import ReviewCard from './ReviewCard.jsx'
import './Reviews.css'

function ReviewList({ reviews, emptyMessage }) {
  if (reviews.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}

export default ReviewList

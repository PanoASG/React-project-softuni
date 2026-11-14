import ReviewCard from './ReviewCard.jsx'
import './Reviews.css'

function ReviewList({ reviews, emptyMessage }) {
  if (reviews.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>
  }

  return (
    <div className="review-list">
      {reviews.map((review, index) => (
        <ReviewCard key={review.id} review={review} index={index} />
      ))}
    </div>
  )
}

export default ReviewList

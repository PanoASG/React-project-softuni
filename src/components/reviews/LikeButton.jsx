import { useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'
import { useFetch } from '../../hooks/useFetch.js'
import { getLikes, likeReview, unlikeReview } from '../../services/likeService.js'
import './Reviews.css'

function LikeButton({ reviewId, reviewOwnerId }) {
  const { user } = useAuth()
  const location = useLocation()
  const userId = user?.id
  const fetchLikes = useCallback(() => getLikes(reviewId, userId), [reviewId, userId])
  const { data, error, isLoading, retry } = useFetch(fetchLikes)
  const [update, setUpdate] = useState(null)
  const [isToggling, setIsToggling] = useState(false)
  const [toggleError, setToggleError] = useState('')

  if (isLoading) {
    return <p className="likes likes--muted">Loading likes...</p>
  }

  if (error) {
    return (
      <p className="likes likes--muted">
        {error.message}{' '}
        <button type="button" className="link-button" onClick={retry}>
          Try again
        </button>
      </p>
    )
  }

  const { count, isLiked } = update?.base === data ? update : data
  const canLike = Boolean(user) && userId !== reviewOwnerId

  const toggleHandler = async () => {
    setIsToggling(true)
    setToggleError('')

    try {
      if (isLiked) {
        await unlikeReview(reviewId, userId)
        setUpdate({ base: data, count: count - 1, isLiked: false })
      } else {
        await likeReview(reviewId, userId)
        setUpdate({ base: data, count: count + 1, isLiked: true })
      }
    } catch (error) {
      setToggleError(error.message)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <div className="likes">
      {canLike && (
        <button
          type="button"
          className={`like-button${isLiked ? ' like-button--active' : ''}`}
          aria-pressed={isLiked}
          onClick={toggleHandler}
          disabled={isToggling}
        >
          <span key={String(isLiked)} className={isLiked ? 'heart-pop' : undefined} aria-hidden="true">
            {isLiked ? '♥' : '♡'}
          </span>{' '}
          {isLiked ? 'Liked' : 'Like'}
        </button>
      )}
      <span key={count} className="likes__count count-bump">
        {count} {count === 1 ? 'like' : 'likes'}
      </span>
      {!user && (
        <Link to="/login" state={{ from: location.pathname }}>
          Log in to like
        </Link>
      )}
      {toggleError && (
        <span className="form-field__error" role="alert">
          {toggleError}
        </span>
      )}
    </div>
  )
}

export default LikeButton

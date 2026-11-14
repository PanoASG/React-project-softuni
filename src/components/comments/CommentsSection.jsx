import { Link, useLocation } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'
import { useComments } from '../../hooks/useComments.js'
import ErrorMessage from '../common/ErrorMessage.jsx'
import LoadingSpinner from '../common/LoadingSpinner.jsx'
import CommentForm from './CommentForm.jsx'
import CommentItem from './CommentItem.jsx'
import './Comments.css'

function CommentsSection({ reviewId }) {
  const { user } = useAuth()
  const location = useLocation()
  const {
    comments,
    total,
    hasMore,
    isLoading,
    loadError,
    isLoadingMore,
    loadMoreError,
    retry,
    loadMore,
    add,
    remove,
  } = useComments(reviewId)

  return (
    <section className="comments" aria-labelledby="comments-title">
      <h2 id="comments-title">Comments {!isLoading && !loadError && `(${total})`}</h2>

      {user ? (
        <CommentForm onAdd={(content) => add(content, user)} />
      ) : (
        <p className="comments__login">
          <Link to="/login" state={{ from: location.pathname }}>
            Log in
          </Link>{' '}
          to join the discussion.
        </p>
      )}

      {isLoading && <LoadingSpinner text="Loading comments..." />}
      {loadError && <ErrorMessage message={loadError} onRetry={retry} />}

      {!isLoading && !loadError && comments.length === 0 && (
        <p className="comments__empty">No comments yet. Start the conversation!</p>
      )}

      {comments.length > 0 && (
        <ul className="comments__list">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isOwn={user?.id === comment.userId}
              onDelete={remove}
            />
          ))}
        </ul>
      )}

      {hasMore && !isLoading && (
        <button type="button" className="button button--secondary comments__more" onClick={loadMore} disabled={isLoadingMore}>
          {isLoadingMore ? 'Loading...' : `Show more comments (${total - comments.length} more)`}
        </button>
      )}
      {loadMoreError && (
        <p className="form__error" role="alert">
          {loadMoreError}
        </p>
      )}
    </section>
  )
}

export default CommentsSection

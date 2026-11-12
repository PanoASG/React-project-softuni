import { useState } from 'react'
import { formatDateTime } from '../../utils/formatDate.js'

function CommentItem({ comment, isOwn, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const deleteHandler = async () => {
    if (!window.confirm('Delete this comment?')) {
      return
    }

    setIsDeleting(true)
    setDeleteError('')

    try {
      await onDelete(comment.id)
    } catch (error) {
      setDeleteError(error.message)
      setIsDeleting(false)
    }
  }

  return (
    <li className="comment">
      <div className="comment__header">
        <span className="comment__author">{comment.username}</span>
        <time className="comment__date" dateTime={comment.createdAt}>
          {formatDateTime(comment.createdAt)}
        </time>
        {isOwn && (
          <button type="button" className="comment__delete" onClick={deleteHandler} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
      <p className="comment__content">{comment.content}</p>
      {deleteError && (
        <p className="form-field__error" role="alert">
          {deleteError}
        </p>
      )}
    </li>
  )
}

export default CommentItem

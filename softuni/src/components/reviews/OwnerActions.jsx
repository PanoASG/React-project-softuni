import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { deleteReview } from '../../services/reviewService.js'

function OwnerActions({ reviewId }) {
  const navigate = useNavigate()
  const [isConfirming, setIsConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const deleteHandler = async () => {
    setIsDeleting(true)
    setDeleteError('')

    try {
      await deleteReview(reviewId)
      navigate('/my-reviews')
    } catch (error) {
      setDeleteError(error.message)
      setIsDeleting(false)
    }
  }

  if (isConfirming) {
    return (
      <div className="owner-actions owner-actions--confirm" role="group" aria-label="Confirm delete">
        <p className="owner-actions__question">Delete this review? This cannot be undone.</p>
        <div className="owner-actions__buttons">
          <button type="button" className="button button--danger" onClick={deleteHandler} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Yes, delete'}
          </button>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => setIsConfirming(false)}
            disabled={isDeleting}
          >
            Cancel
          </button>
        </div>
        {deleteError && (
          <p className="form__error" role="alert">
            {deleteError}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="owner-actions">
      <div className="owner-actions__buttons">
        <Link to={`/books/${reviewId}/edit`} className="button">
          Edit
        </Link>
        <button type="button" className="button button--secondary" onClick={() => setIsConfirming(true)}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default OwnerActions

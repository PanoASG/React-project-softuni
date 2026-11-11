import { useCallback } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import ErrorMessage from '../components/common/ErrorMessage.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import ReviewForm from '../components/reviews/ReviewForm.jsx'
import ReviewNotFound from '../components/reviews/ReviewNotFound.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useFetch } from '../hooks/useFetch.js'
import { getReviewById, updateReview } from '../services/reviewService.js'

function EditBookPage() {
  const { bookId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const fetchReview = useCallback(() => getReviewById(bookId), [bookId])
  const { data: review, error, isLoading, retry } = useFetch(fetchReview)

  if (isLoading) {
    return <LoadingSpinner text="Loading review..." />
  }

  if (error?.notFound) {
    return <ReviewNotFound message={error.message} />
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={retry} />
  }

  if (review.userId !== user.id) {
    return <Navigate to={`/books/${bookId}`} replace />
  }

  const editHandler = async (values) => {
    await updateReview(bookId, values)
    navigate(`/books/${bookId}`)
  }

  const initialValues = {
    title: review.title,
    author: review.author,
    genre: review.genre,
    rating: String(review.rating),
    coverUrl: review.coverUrl ?? '',
    content: review.content,
  }

  return (
    <section className="form-page">
      <h1>Edit review</h1>
      <ReviewForm
        initialValues={initialValues}
        onSubmit={editHandler}
        submitLabel="Save changes"
        submittingLabel="Saving..."
      />
    </section>
  )
}

export default EditBookPage

import { useNavigate } from 'react-router'
import ReviewForm from '../components/reviews/ReviewForm.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { createReview } from '../services/reviewService.js'

const initialValues = {
  title: '',
  author: '',
  genre: '',
  rating: '',
  coverUrl: '',
  content: '',
}

function CreateBookPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const createHandler = async (values) => {
    const review = await createReview(values, user)
    navigate(`/books/${review.id}`)
  }

  return (
    <section className="form-page">
      <h1>Add a review</h1>
      <ReviewForm
        initialValues={initialValues}
        onSubmit={createHandler}
        submitLabel="Publish review"
        submittingLabel="Publishing..."
      />
    </section>
  )
}

export default CreateBookPage

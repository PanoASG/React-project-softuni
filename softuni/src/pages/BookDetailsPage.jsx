import { useParams } from 'react-router'

function BookDetailsPage() {
  const { bookId } = useParams()

  return (
    <section>
      <h1>Review details</h1>
      <p className="page__intro"></p>
    </section>
  )
}

export default BookDetailsPage

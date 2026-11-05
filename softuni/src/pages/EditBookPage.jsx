import { useParams } from 'react-router'

function EditBookPage() {
  const { bookId } = useParams()

  return (
    <section>
      <h1>Edit review</h1>
      <p className="page__intro"></p>
    </section>
  )
}

export default EditBookPage

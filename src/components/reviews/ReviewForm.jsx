import { useForm } from '../../hooks/useForm.js'
import { GENRES } from '../../utils/genres.js'
import { validateReview } from '../../utils/validation.js'
import FormField from '../common/FormField.jsx'

const genreOptions = GENRES.map((genre) => ({ value: genre, label: genre }))

const ratingOptions = [5, 4, 3, 2, 1].map((rating) => ({
  value: String(rating),
  label: `${'★'.repeat(rating)} (${rating})`,
}))

function ReviewForm({ initialValues, onSubmit, submitLabel, submittingLabel }) {
  const { values, errors, submitError, isSubmitting, changeHandler, submitHandler } = useForm(
    initialValues,
    validateReview,
    onSubmit,
  )

  return (
    <form className="form" onSubmit={submitHandler} noValidate>
      <FormField
        label="Book title"
        name="title"
        value={values.title}
        onChange={changeHandler}
        error={errors.title}
      />
      <FormField
        label="Author"
        name="author"
        value={values.author}
        onChange={changeHandler}
        error={errors.author}
      />
      <div className="form__row">
        <FormField
          label="Genre"
          name="genre"
          as="select"
          options={genreOptions}
          placeholder="Choose a genre"
          value={values.genre}
          onChange={changeHandler}
          error={errors.genre}
        />
        <FormField
          label="Rating"
          name="rating"
          as="select"
          options={ratingOptions}
          placeholder="Choose a rating"
          value={values.rating}
          onChange={changeHandler}
          error={errors.rating}
        />
      </div>
      <FormField
        label="Cover image link (optional)"
        name="coverUrl"
        type="url"
        placeholder="https://..."
        value={values.coverUrl}
        onChange={changeHandler}
        error={errors.coverUrl}
      />
      <FormField
        label="Your review"
        name="content"
        as="textarea"
        placeholder="What did you think of the book?"
        value={values.content}
        onChange={changeHandler}
        error={errors.content}
      />
      {submitError && (
        <p className="form__error" role="alert">
          {submitError}
        </p>
      )}
      <button type="submit" className="button" disabled={isSubmitting}>
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </form>
  )
}

export default ReviewForm

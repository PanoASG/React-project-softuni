import { useForm } from '../../hooks/useForm.js'
import { validateComment } from '../../utils/validation.js'
import FormField from '../common/FormField.jsx'

const initialValues = { content: '' }

function CommentForm({ onAdd }) {
  const { values, errors, submitError, isSubmitting, changeHandler, submitHandler } = useForm(
    initialValues,
    validateComment,
    (formValues) => onAdd(formValues.content),
    { resetOnSuccess: true },
  )

  return (
    <form className="comment-form" onSubmit={submitHandler} noValidate>
      <FormField
        label="Add a comment"
        name="content"
        as="textarea"
        rows={3}
        placeholder="Share your thoughts on this review..."
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
        {isSubmitting ? 'Posting...' : 'Post comment'}
      </button>
    </form>
  )
}

export default CommentForm

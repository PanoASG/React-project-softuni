import { Link } from 'react-router'
import FormField from '../components/common/FormField.jsx'
import { useForm } from '../hooks/useForm.js'
import { register } from '../services/authService.js'
import { validateRegister } from '../utils/validation.js'

const initialValues = { email: '', username: '', password: '', rePassword: '' }

function RegisterPage() {
  const { values, errors, submitError, isSubmitting, changeHandler, submitHandler } = useForm(
    initialValues,
    validateRegister,
    register,
  )

  return (
    <section className="auth">
      <h1>Register</h1>
      <form className="form" onSubmit={submitHandler} noValidate>
        <FormField
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={changeHandler}
          error={errors.email}
          autoComplete="email"
        />
        <FormField
          label="Username"
          name="username"
          value={values.username}
          onChange={changeHandler}
          error={errors.username}
          autoComplete="username"
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={changeHandler}
          error={errors.password}
          autoComplete="new-password"
        />
        <FormField
          label="Repeat password"
          name="rePassword"
          type="password"
          value={values.rePassword}
          onChange={changeHandler}
          error={errors.rePassword}
          autoComplete="new-password"
        />
        {submitError && (
          <p className="form__error" role="alert">
            {submitError}
          </p>
        )}
        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="auth__switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  )
}

export default RegisterPage

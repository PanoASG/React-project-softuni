import { Link } from 'react-router'
import FormField from '../components/common/FormField.jsx'
import { useForm } from '../hooks/useForm.js'
import { login } from '../services/authService.js'
import { validateLogin } from '../utils/validation.js'

const initialValues = { email: '', password: '' }

function LoginPage() {
  const { values, errors, submitError, isSubmitting, changeHandler, submitHandler } = useForm(
    initialValues,
    validateLogin,
    login,
  )

  return (
    <section className="auth">
      <h1>Login</h1>
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
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={changeHandler}
          error={errors.password}
          autoComplete="current-password"
        />
        {submitError && (
          <p className="form__error" role="alert">
            {submitError}
          </p>
        )}
        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="auth__switch">
        No account yet? <Link to="/register">Register</Link>
      </p>
    </section>
  )
}

export default LoginPage

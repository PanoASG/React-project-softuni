const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,20}$/
const MIN_PASSWORD_LENGTH = 6

function validateEmail(email) {
  if (!email.trim()) {
    return 'Email is required.'
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    return 'Enter a valid email address.'
  }

  return ''
}

function withoutEmpty(errors) {
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message))
}

export function validateLogin({ email, password }) {
  return withoutEmpty({
    email: validateEmail(email),
    password: password ? '' : 'Password is required.',
  })
}

export function validateRegister({ email, username, password, rePassword }) {
  let usernameError = ''
  if (!username.trim()) {
    usernameError = 'Username is required.'
  } else if (!USERNAME_PATTERN.test(username.trim())) {
    usernameError = 'Use 3-20 letters, numbers or underscores.'
  }

  let passwordError = ''
  if (!password) {
    passwordError = 'Password is required.'
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    passwordError = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }

  return withoutEmpty({
    email: validateEmail(email),
    username: usernameError,
    password: passwordError,
    rePassword: password === rePassword ? '' : 'Passwords do not match.',
  })
}

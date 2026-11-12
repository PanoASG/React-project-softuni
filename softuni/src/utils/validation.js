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

function isValidHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function validateLength(value, label, min, max) {
  const length = value.trim().length

  if (length === 0) {
    return `${label} is required.`
  }

  if (length < min) {
    return `${label} must be at least ${min} characters.`
  }

  if (length > max) {
    return `${label} must be at most ${max} characters.`
  }

  return ''
}

export function validateReview({ title, author, genre, rating, coverUrl, content }) {
  const ratingNumber = Number(rating)

  return withoutEmpty({
    title: validateLength(title, 'Title', 1, 150),
    author: validateLength(author, 'Author', 1, 100),
    genre: genre ? '' : 'Choose a genre.',
    rating: Number.isInteger(ratingNumber) && ratingNumber >= 1 && ratingNumber <= 5 ? '' : 'Choose a rating from 1 to 5.',
    coverUrl: !coverUrl.trim() || isValidHttpUrl(coverUrl.trim()) ? '' : 'Enter a full image link starting with http:// or https://',
    content: validateLength(content, 'Review', 10, 3000),
  })
}

export function validateComment({ content }) {
  return withoutEmpty({
    content: validateLength(content, 'Comment', 1, 1000),
  })
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

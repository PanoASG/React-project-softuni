import { supabase } from './supabaseClient.js'

const friendlyMessages = {
  invalid_credentials: 'Wrong email or password.',
  user_already_exists: 'An account with this email already exists.',
  email_exists: 'An account with this email already exists.',
  weak_password: 'This password is too weak. Use at least 6 characters.',
  over_request_rate_limit: 'Too many attempts. Please wait a minute and try again.',
}

function toFriendlyError(error) {
  if (error.name === 'AuthRetryableFetchError') {
    return new Error('Could not reach the server. Check your internet connection and try again.')
  }

  return new Error(friendlyMessages[error.code] ?? error.message ?? 'Something went wrong. Please try again.')
}

export async function register({ email, username, password }) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { username: username.trim() } },
  })

  if (error) {
    throw toFriendlyError(error)
  }

  return data.user
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) {
    throw toFriendlyError(error)
  }

  return data.user
}

export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw toFriendlyError(error)
  }
}

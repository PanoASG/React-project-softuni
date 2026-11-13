import { supabase } from './supabaseClient.js'

const COLUMNS = 'id, created_at, user_id, username, book_title, book_author, genre, rating, cover_url, content'
const LIST_COLUMNS = `${COLUMNS}, likes(count), comments(count)`

function toReview(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    userId: row.user_id,
    username: row.username,
    title: row.book_title,
    author: row.book_author,
    genre: row.genre,
    rating: row.rating,
    coverUrl: row.cover_url,
    content: row.content,
    likeCount: row.likes?.[0]?.count ?? 0,
    commentCount: row.comments?.[0]?.count ?? 0,
  }
}

function toRow(values) {
  return {
    book_title: values.title.trim(),
    book_author: values.author.trim(),
    genre: values.genre,
    rating: Number(values.rating),
    cover_url: values.coverUrl.trim() || null,
    content: values.content.trim(),
  }
}

function notFoundError() {
  const error = new Error('This review does not exist or has been deleted.')
  error.notFound = true
  return error
}

export async function getAllReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select(LIST_COLUMNS)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Could not load reviews. Please try again.')
  }

  return data.map(toReview)
}

export async function getLatestReviews(limit = 3) {
  const { data, error } = await supabase
    .from('reviews')
    .select(LIST_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error('Could not load the latest reviews. Please try again.')
  }

  return data.map(toReview)
}

export async function getReviewsByUser(userId) {
  const { data, error } = await supabase
    .from('reviews')
    .select(LIST_COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Could not load your reviews. Please try again.')
  }

  return data.map(toReview)
}

export async function getReviewById(id) {
  const { data, error } = await supabase.from('reviews').select(COLUMNS).eq('id', id).maybeSingle()

  if (error?.code === '22P02' || (!error && !data)) {
    throw notFoundError()
  }

  if (error) {
    throw new Error('Could not load this review. Please try again.')
  }

  return toReview(data)
}

export async function createReview(values, user) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      ...toRow(values),
      user_id: user.id,
      username: user.user_metadata?.username ?? user.email,
    })
    .select(COLUMNS)
    .single()

  if (error) {
    throw new Error('Could not save your review. Please try again.')
  }

  return toReview(data)
}

export async function updateReview(id, values) {
  const { data, error } = await supabase
    .from('reviews')
    .update(toRow(values))
    .eq('id', id)
    .select(COLUMNS)
    .maybeSingle()

  if (error) {
    throw new Error('Could not save your changes. Please try again.')
  }

  if (!data) {
    throw new Error('You can only edit your own reviews.')
  }

  return toReview(data)
}

export async function deleteReview(id) {
  const { data, error } = await supabase.from('reviews').delete().eq('id', id).select('id')

  if (error) {
    throw new Error('Could not delete this review. Please try again.')
  }

  if (data.length === 0) {
    throw new Error('You can only delete your own reviews.')
  }
}

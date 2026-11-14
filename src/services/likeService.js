import { supabase } from './supabaseClient.js'

const DUPLICATE_KEY = '23505'

export async function getLikes(reviewId, userId) {
  const countRequest = supabase
    .from('likes')
    .select('review_id', { count: 'exact', head: true })
    .eq('review_id', reviewId)

  const ownLikeRequest = userId
    ? supabase.from('likes').select('review_id').eq('review_id', reviewId).eq('user_id', userId).maybeSingle()
    : Promise.resolve({ data: null, error: null })

  const [countResult, ownLikeResult] = await Promise.all([countRequest, ownLikeRequest])

  if (countResult.error || ownLikeResult.error) {
    throw new Error('Could not load likes.')
  }

  return { count: countResult.count ?? 0, isLiked: Boolean(ownLikeResult.data) }
}

export async function likeReview(reviewId, userId) {
  const { error } = await supabase.from('likes').insert({ review_id: reviewId, user_id: userId })

  if (error && error.code !== DUPLICATE_KEY) {
    throw new Error('Could not like this review. Please try again.')
  }
}

export async function unlikeReview(reviewId, userId) {
  const { error } = await supabase.from('likes').delete().eq('review_id', reviewId).eq('user_id', userId)

  if (error) {
    throw new Error('Could not remove your like. Please try again.')
  }
}

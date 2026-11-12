import { supabase } from './supabaseClient.js'

export const COMMENTS_PAGE_SIZE = 5

const COLUMNS = 'id, created_at, review_id, user_id, username, content'

function toComment(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    reviewId: row.review_id,
    userId: row.user_id,
    username: row.username,
    content: row.content,
  }
}

export async function getComments(reviewId, offset = 0) {
  const { data, count, error } = await supabase
    .from('comments')
    .select(COLUMNS, { count: 'exact' })
    .eq('review_id', reviewId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .range(offset, offset + COMMENTS_PAGE_SIZE - 1)

  if (error) {
    throw new Error('Could not load comments. Please try again.')
  }

  return { comments: data.map(toComment), total: count ?? 0 }
}

export async function addComment(reviewId, content, user) {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      review_id: reviewId,
      user_id: user.id,
      username: user.user_metadata?.username ?? user.email,
      content: content.trim(),
    })
    .select(COLUMNS)
    .single()

  if (error) {
    throw new Error('Could not post your comment. Please try again.')
  }

  return toComment(data)
}

export async function deleteComment(commentId) {
  const { data, error } = await supabase.from('comments').delete().eq('id', commentId).select('id')

  if (error) {
    throw new Error('Could not delete this comment. Please try again.')
  }

  if (data.length === 0) {
    throw new Error('You can only delete your own comments.')
  }
}

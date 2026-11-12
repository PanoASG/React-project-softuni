import { useEffect, useState } from 'react'
import { addComment, deleteComment, getComments } from '../services/commentService.js'

export function useComments(reviewId) {
  const [comments, setComments] = useState([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('loading')
  const [loadError, setLoadError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState('')

  useEffect(() => {
    let ignore = false

    getComments(reviewId)
      .then((page) => {
        if (!ignore) {
          setComments(page.comments)
          setTotal(page.total)
          setStatus('ready')
        }
      })
      .catch((error) => {
        if (!ignore) {
          setLoadError(error.message)
          setStatus('error')
        }
      })

    return () => {
      ignore = true
    }
  }, [reviewId, attempt])

  const retry = () => {
    setStatus('loading')
    setLoadError('')
    setAttempt((current) => current + 1)
  }

  const loadMore = async () => {
    setIsLoadingMore(true)
    setLoadMoreError('')

    try {
      const page = await getComments(reviewId, comments.length)
      setComments((current) => {
        const loadedIds = new Set(current.map((comment) => comment.id))
        return [...current, ...page.comments.filter((comment) => !loadedIds.has(comment.id))]
      })
      setTotal(page.total)
    } catch (error) {
      setLoadMoreError(error.message)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const add = async (content, user) => {
    const comment = await addComment(reviewId, content, user)
    setComments((current) => [comment, ...current])
    setTotal((current) => current + 1)
  }

  const remove = async (commentId) => {
    await deleteComment(commentId)
    setComments((current) => current.filter((comment) => comment.id !== commentId))
    setTotal((current) => current - 1)
  }

  return {
    comments,
    total,
    hasMore: comments.length < total,
    isLoading: status === 'loading',
    loadError: status === 'error' ? loadError : '',
    isLoadingMore,
    loadMoreError,
    retry,
    loadMore,
    add,
    remove,
  }
}

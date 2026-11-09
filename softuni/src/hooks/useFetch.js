import { useEffect, useState } from 'react'

export function useFetch(fetcher) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ fetcher: null, attempt: -1, data: null, error: null })

  useEffect(() => {
    let ignore = false

    fetcher()
      .then((data) => {
        if (!ignore) {
          setResult({ fetcher, attempt, data, error: null })
        }
      })
      .catch((error) => {
        if (!ignore) {
          setResult({ fetcher, attempt, data: null, error })
        }
      })

    return () => {
      ignore = true
    }
  }, [fetcher, attempt])

  const isLoading = result.fetcher !== fetcher || result.attempt !== attempt
  const retry = () => setAttempt((current) => current + 1)

  return {
    data: isLoading ? null : result.data,
    error: isLoading ? null : result.error,
    isLoading,
    retry,
  }
}

import { useState } from 'react'
import './Reviews.css'

function BookCover({ url, title, className = '' }) {
  const [failedUrl, setFailedUrl] = useState(null)

  if (!url || failedUrl === url) {
    return (
      <div className={`cover cover--placeholder ${className}`} aria-hidden="true">
        {title.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      className={`cover ${className}`}
      src={url}
      alt={`Cover of ${title}`}
      onError={() => setFailedUrl(url)}
    />
  )
}

export default BookCover

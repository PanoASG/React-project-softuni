function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="loading" role="status">
      <span className="loading__spinner" aria-hidden="true" />
      <span>{text}</span>
    </div>
  )
}

export default LoadingSpinner

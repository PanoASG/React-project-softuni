import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'
import LoadingSpinner from '../common/LoadingSpinner.jsx'

function GuestGuard() {
  const { isAuthenticated, isAuthLoading } = useAuth()
  const location = useLocation()

  if (isAuthLoading) {
    return <LoadingSpinner />
  }

  if (isAuthenticated) {
    return <Navigate to={location.state?.from ?? '/'} replace />
  }

  return <Outlet />
}

export default GuestGuard

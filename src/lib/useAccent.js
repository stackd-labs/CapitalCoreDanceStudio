import { useLocation } from 'react-router-dom'
import { accentForPath } from './pageAccents'

// Resolves the current page's accent, or honours an explicit override. Lives outside
// components/blocks.jsx so that file exports only components and keeps fast refresh.
export function useAccent(override) {
  const { pathname } = useLocation()
  return override || accentForPath(pathname)
}

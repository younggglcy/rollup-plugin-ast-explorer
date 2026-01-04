import { createRoot } from 'react-dom/client'
import { ClientApp } from '@/ssr/ClientApp'

// Use createRoot instead of hydrateRoot to avoid hydration mismatches
// This is appropriate for a dev tool that doesn't need SSR benefits
const root = document.getElementById('root')
if (root) {
  createRoot(root).render(<ClientApp />)
}

import { hydrateRoot } from 'react-dom/client'
import { App } from '@/ssr/App'

hydrateRoot(
  document,
  <App />,
)

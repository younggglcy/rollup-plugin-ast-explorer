import { hydrateRoot } from 'react-dom/client'
import { App } from '@/node/ssr/App'

hydrateRoot(document, <App />)

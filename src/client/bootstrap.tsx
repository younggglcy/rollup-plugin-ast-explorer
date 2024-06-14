import { hydrateRoot } from 'react-dom/client'
import { App } from '@/node/ssr/App'

hydrateRoot(
  document,
  <App
    assetsMap={window.assetsMap as unknown as typeof import('@/node/constants').assetsMap}
  />,
)

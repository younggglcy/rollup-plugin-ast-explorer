import type { ModuleInfosMap } from '@/types'
import { MODULES_STOREAGE_KEY } from '@/constants'
import { App } from '@/ssr/App'
import { stringToMap } from '@/utils'
import { hydrateRoot } from 'react-dom/client'

hydrateRoot(
  document,
  <App
    initialModulesInfo={stringToMap<ModuleInfosMap>(localStorage.getItem(MODULES_STOREAGE_KEY) || '')}
  />,
)

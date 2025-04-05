import type { ModuleInfosMap } from '@/types'
import { renderToPipeableStream } from 'react-dom/server'
import { App } from './App'

interface ServerRenderProps {
  initialModulesInfo: ModuleInfosMap
}

export function render(props: ServerRenderProps) {
  const {
    initialModulesInfo,
  } = props

  return renderToPipeableStream(
    <App
      initialModulesInfo={initialModulesInfo}
    />,
    {
      bootstrapModules: [
        '/main.css.js',
        '/entry-client.js',
      ],
    },
  )
}

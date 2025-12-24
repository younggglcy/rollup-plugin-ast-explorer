import type { ModuleMetadata, WSEvent } from '@rollup-plugin-ast-explorer/shared'
import { EventType } from '@rollup-plugin-ast-explorer/shared'
import { useEffect, useState } from 'react'
import { createWebSocketConnection, fetchModules } from '@/lib/api'

export function useModules() {
  const [modules, setModules] = useState<ModuleMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ws: WebSocket | null = null

    async function loadModules() {
      try {
        setLoading(true)
        const data = await fetchModules()
        setModules(data)
        setError(null)
      }
      catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load modules')
      }
      finally {
        setLoading(false)
      }
    }

    function handleWebSocketMessage(event: WSEvent) {
      if (event.type === EventType.BuildStart) {
        // eslint-disable-next-line no-console
        console.log('Build started')
      }
      else if (event.type === EventType.BuildEnd) {
        // eslint-disable-next-line no-console
        console.log('Build ended')
        // Reload modules after build
        loadModules()
      }
      else if (event.type === EventType.ModuleParsed) {
        // eslint-disable-next-line no-console
        console.log('Module parsed:', event.moduleId)
        // Optionally reload modules
        loadModules()
      }
    }

    // Initial load
    loadModules()

    // Setup WebSocket for live updates
    ws = createWebSocketConnection(handleWebSocketMessage)

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])

  return { modules, loading, error }
}

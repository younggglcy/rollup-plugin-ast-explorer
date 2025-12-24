import type { ASTResponse, ModuleMetadata, ModulesResponse, WSEvent } from '@rollup-plugin-ast-explorer/shared'

const API_BASE = 'http://localhost:4178'

export async function fetchModules(): Promise<ModuleMetadata[]> {
  const response = await fetch(`${API_BASE}/modules`)
  if (!response.ok) {
    throw new Error(`Failed to fetch modules: ${response.statusText}`)
  }
  const data: ModulesResponse = await response.json()
  return data.modules
}

export async function fetchAST(moduleId: string): Promise<ASTResponse> {
  const response = await fetch(`${API_BASE}/ast/${encodeURIComponent(moduleId)}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch AST: ${response.statusText}`)
  }
  return response.json()
}

export function createWebSocketConnection(
  onMessage: (event: WSEvent) => void,
  onError?: (error: Event) => void,
): WebSocket {
  const ws = new WebSocket('ws://localhost:4178/ws')

  ws.onmessage = (event) => {
    try {
      const data: WSEvent = JSON.parse(event.data)
      onMessage(data)
    }
    catch (error) {
      console.error('Failed to parse WebSocket message:', error)
    }
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
    if (onError) {
      onError(error)
    }
  }

  ws.onopen = () => {
    // eslint-disable-next-line no-console
    console.log('WebSocket connected')
  }

  ws.onclose = () => {
    // eslint-disable-next-line no-console
    console.log('WebSocket disconnected')
  }

  return ws
}

import type { ASTResponse, ModuleMetadata, ModulesResponse, WSEvent } from '@rollup-plugin-ast-explorer/shared'
import type { IncomingMessage } from 'node:http'
import type { ModuleInfo } from 'rollup'
import type { WebSocket } from 'ws'
import { createServer as createHttpServer } from 'node:http'
import { EventType } from '@rollup-plugin-ast-explorer/shared'
import detect from 'detect-port'
import { createApp, createRouter, defineEventHandler, getRouterParam, toNodeListener } from 'h3'
import { cyan } from 'picocolors'
import { WebSocketServer } from 'ws'
import { DEFAULT_HOST, DEFAULT_PORT } from './constants'
import { logger } from './logger'
import { sanitizeAST } from './utils'

export interface ServerOptions {
  port?: number
  host?: string
  keepCode?: boolean
}

export interface ServerContext {
  modules: Map<string, ModuleInfo>
  keepCode: boolean
}

export async function createServer(options: ServerOptions, context: ServerContext) {
  const {
    host = DEFAULT_HOST,
    port: _port = DEFAULT_PORT,
  } = options

  const port = await detect({
    hostname: host,
    port: _port,
  })

  if (port !== _port) {
    logger(`Port ${_port} is in use, using ${port} instead`)
  }

  const address = `http://${host}:${port}`
  const app = createApp()
  const router = createRouter()

  // GET /modules - returns list of all parsed modules
  router.get('/modules', defineEventHandler((): ModulesResponse => {
    const modules: ModuleMetadata[] = []

    for (const [id, info] of context.modules) {
      modules.push({
        id,
        code: context.keepCode ? info.code : null,
        isEntry: info.isEntry,
        isExternal: info.isExternal,
        importedIds: info.importedIds,
        importers: info.importers,
        dynamicallyImportedIds: info.dynamicallyImportedIds,
      })
    }

    return { modules }
  }))

  // GET /ast/:id - returns AST for a specific module
  router.get('/ast/:id', defineEventHandler((event): ASTResponse => {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw new Error('Module ID is required')
    }

    const info = context.modules.get(id)
    if (!info) {
      throw new Error(`Module not found: ${id}`)
    }

    const sanitized = sanitizeAST(info.ast)

    return {
      id,
      ast: sanitized,
      code: context.keepCode ? (info.code ?? undefined) : undefined,
    }
  }))

  app.use(router)

  const httpServer = createHttpServer(toNodeListener(app))

  // WebSocket server for live updates
  const wss = new WebSocketServer({ noServer: true })
  const clients = new Set<WebSocket>()

  httpServer.on('upgrade', (request: IncomingMessage, socket, head) => {
    const { url } = request
    if (url === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request)
      })
    }
    else {
      socket.destroy()
    }
  })

  wss.on('connection', (ws: WebSocket) => {
    logger('WebSocket client connected')
    clients.add(ws)

    ws.on('close', () => {
      logger('WebSocket client disconnected')
      clients.delete(ws)
    })

    ws.on('error', (error) => {
      logger('WebSocket error:', error)
      clients.delete(ws)
    })
  })

  httpServer.listen(port, host, () => {
    logger(`Server started listening on ${address}`)
    // eslint-disable-next-line no-console
    console.log(cyan(`rollup-plugin-ast-explorer: visit ${address} to explore the AST`))
  })

  // Helper function to broadcast events to all connected clients
  function broadcast(event: WSEvent) {
    const message = JSON.stringify(event)
    for (const client of clients) {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(message)
      }
    }
  }

  // Public API
  return {
    httpServer,
    wss,
    broadcast,
    close: () => {
      return new Promise<void>((resolve) => {
        // Close all WebSocket connections
        for (const client of clients) {
          client.close()
        }
        wss.close()

        // Close HTTP server
        httpServer.close(() => {
          logger('Server closed')
          resolve()
        })
      })
    },
    emitBuildStart: () => {
      broadcast({
        type: EventType.BuildStart,
        timestamp: Date.now(),
      })
    },
    emitBuildEnd: (error?: Error) => {
      broadcast({
        type: EventType.BuildEnd,
        timestamp: Date.now(),
        error: error?.message,
      })
    },
    emitModuleParsed: (moduleId: string) => {
      broadcast({
        type: EventType.ModuleParsed,
        timestamp: Date.now(),
        moduleId,
      })
    },
  }
}

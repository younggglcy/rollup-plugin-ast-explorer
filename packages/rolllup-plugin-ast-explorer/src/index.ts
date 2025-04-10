import type { AppOptions } from 'h3'
import type { Plugin } from 'rollup'
import type { ModuleInfosMap } from './types'
import { HOST, PORT } from '@/constants'
import { logger } from '@/logger'
import { createServer } from '@/server'
import { BehaviorSubject } from 'rxjs'

/**
 * Controls the `h3`-based server's behavior
 */
export interface ASTExplorerServerOptions extends Omit<AppOptions, 'websocket'> {
  /**
   * Which port to listen on. If the given port
   * is not available, `detect-port` will be used
   * to find a new port.
   * @default 7777
   */
  port?: number

  /**
   * Which host to listen on
   * @default 'localhost'
   */
  host?: string
}

export interface ASTExplorerOptions {
  server?: ASTExplorerServerOptions
}

export function astExplorer(options?: ASTExplorerOptions): Plugin {
  const {
    server: serverOptions = {
      port: PORT,
      host: HOST,
    },
  } = options ?? {}

  let server: Awaited<ReturnType<typeof createServer>>
  const moduleInfosMap: ModuleInfosMap = new Map()
  const moduleInfosSubject = new BehaviorSubject<ModuleInfosMap>(moduleInfosMap)

  return {
    name: 'rollup-plugin-ast-explorer',

    version: __ROLLUP_PLUGIN_AST_EXPLORER_VERSION__,

    buildStart: {
      order: 'pre',
      sequential: false,
      handler: async (_options) => {
        if (!server) {
          server = await createServer({
            serverOptions,
            modulesSource: moduleInfosSubject,
          })
        }
        if (moduleInfosMap.size) {
          moduleInfosMap.clear()
        }
      },
    },

    moduleParsed: {
      order: 'pre',
      sequential: false,
      handler: (info) => {
        moduleInfosMap.set(info.id, info)
      },
    },

    buildEnd: {
      order: 'post',
      sequential: false,
      handler: (error) => {
        if (error) {
          logger('Error during build', error)
          // TODO: display on client side
        }
      },
    },
  }
}

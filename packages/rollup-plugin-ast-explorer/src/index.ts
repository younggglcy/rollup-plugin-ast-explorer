import type { Plugin } from 'rollup'
import type { AppOptions } from 'h3'
import { createServer } from '@/node/server'
import { logger } from '@/node/logger'
import { HOST, PORT } from '@/node/constants'

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

  return {
    name: 'rollup-plugin-ast-explorer',

    version: __ROLLUP_PLUGIN_AST_EXPLORER_VERSION__,

    watchChange: {
      order: 'pre',
      sequential: false,
      handler: (id, change) => {
        logger('watchChange', id, change.event)
      },
    },

    buildStart: {
      order: 'pre',
      sequential: false,
      handler: async (_options) => {
        if (!server) {
          server = await createServer(serverOptions)
        }
      },
    },

    moduleParsed: {
      order: 'pre',
      sequential: false,
      handler: (_info) => {

      },
    },
  }
}

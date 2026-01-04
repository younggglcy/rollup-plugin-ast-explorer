import type { AppOptions } from 'h3'
import type { Plugin } from 'rollup'
import type { ModuleInfosMap, ServerContext } from './types'
import { relative } from 'node:path'
import process from 'node:process'
import { BehaviorSubject } from 'rxjs'
import { HOST, PORT } from '@/constants'
import { logger } from '@/logger'
import { createServer } from '@/server'

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
  /**
   * The current working directory.
   *
   * This is used to help the plugin to know the relative path of each module.
   * @default `process.cwd()`
   */
  cwd?: string
}

export function astExplorer(options?: ASTExplorerOptions): Plugin {
  const {
    server: serverOptions = {
      port: PORT,
      host: HOST,
    },
    cwd = process.cwd(),
  } = options ?? {}

  let server: Awaited<ReturnType<typeof createServer>>
  const moduleInfosMap: ModuleInfosMap = new Map()
  const moduleInfosSubject = new BehaviorSubject<ModuleInfosMap>(moduleInfosMap)
  const serverContext: ServerContext = {
    moduleInfos: moduleInfosSubject,
  }

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
            context: serverContext,
          })
        }
        if (moduleInfosMap.size) {
          logger('rebuilding..., clearing moduleInfosMap')
          moduleInfosMap.clear()
        }
      },
    },

    moduleParsed: {
      order: 'pre',
      sequential: false,
      handler: (info) => {
        const path = relative(cwd, info.id)
        moduleInfosMap.set(path, info)
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

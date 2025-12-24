import type { FilterPattern } from '@rollup/pluginutils'
import type { ModuleInfo, Plugin } from 'rollup'
import { relative } from 'node:path'
import process from 'node:process'
import { createFilter } from '@rollup/pluginutils'
import { DEFAULT_HOST, DEFAULT_PORT } from './constants'
import { logger } from './logger'
import { createServer } from './server'

/**
 * Options for the AST Explorer plugin
 */
export interface ASTExplorerOptions {
  /**
   * Port for the HTTP and WebSocket server
   * @default 4178
   */
  port?: number

  /**
   * Host for the server
   * @default 'localhost'
   */
  host?: string

  /**
   * Include pattern for modules to track
   * @default undefined (all modules)
   */
  include?: FilterPattern

  /**
   * Exclude pattern for modules to skip
   * @default undefined
   */
  exclude?: FilterPattern

  /**
   * Whether to keep source code in module metadata
   * @default true
   */
  keepCode?: boolean

  /**
   * Current working directory for relative paths
   * @default process.cwd()
   */
  cwd?: string
}

export function astExplorer(options: ASTExplorerOptions = {}): Plugin {
  const {
    port = DEFAULT_PORT,
    host = DEFAULT_HOST,
    include,
    exclude,
    keepCode = true,
    cwd = process.cwd(),
  } = options

  const filter = createFilter(include, exclude)
  const modules = new Map<string, ModuleInfo>()
  let server: Awaited<ReturnType<typeof createServer>> | null = null

  return {
    name: 'rollup-plugin-ast-explorer',

    buildStart: {
      order: 'pre',
      sequential: false,
      async handler() {
        if (!server) {
          server = await createServer(
            { port, host, keepCode },
            { modules, keepCode },
          )
        }

        // Clear modules on rebuild
        if (modules.size > 0) {
          logger('Rebuilding, clearing modules')
          modules.clear()
        }

        // Emit build-start event
        server.emitBuildStart()
      },
    },

    moduleParsed: {
      order: 'pre',
      sequential: false,
      handler(info) {
        // Apply filter
        if (!filter(info.id)) {
          return
        }

        // Store module with relative path as key
        const relativePath = relative(cwd, info.id)
        modules.set(relativePath, info)

        logger(`Module parsed: ${relativePath}`)

        // Emit module-parsed event
        if (server) {
          server.emitModuleParsed(relativePath)
        }
      },
    },

    buildEnd: {
      order: 'post',
      sequential: false,
      handler(error) {
        if (error) {
          logger('Build error:', error)
        }

        // Emit build-end event
        if (server) {
          server.emitBuildEnd(error instanceof Error ? error : undefined)
        }
      },
    },

    closeWatcher: {
      order: 'post',
      sequential: false,
      async handler() {
        if (server) {
          logger('Closing server')
          await server.close()
          server = null
        }
      },
    },
  }
}

export default astExplorer

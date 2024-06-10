import { createServer as createHttpServer } from 'node:http'
import detect from 'detect-port'
import { createApp, toNodeListener } from 'h3'
import { cyan } from 'picocolors'
import { logger } from '../logger'
import { HOST, PORT } from '../constants'
import { router } from './router'
import type { ASTExplorerServerOptions } from '@/index'

export async function createServer(options: ASTExplorerServerOptions) {
  const {
    host = HOST,
    port: _port = PORT,
    ...h3AppOptions
  } = options

  const app = createApp(h3AppOptions)
  app
    .use(router)

  const server = createHttpServer(toNodeListener(app))
  const port = await detect({
    hostname: host,
    port: _port,
  })
  const address = `http://${host}:${port}`
  return server
    .listen(port, host, () => {
      logger(`Server started listening on ${address}`)
      // eslint-disable-next-line no-console
      console.log(cyan(`rollup-plugin-ast-explorer-v${__ROLLUP_PLUGIN_AST_EXPLORER_VERSION__}: visit ${address} to explore the rollup's AST`))
    })
}
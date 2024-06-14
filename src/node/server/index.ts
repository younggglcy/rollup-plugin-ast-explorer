import { createServer as createHttpServer } from 'node:http'
import wsAdapter from 'crossws/adapters/node'
import detect from 'detect-port'
import { createApp, toNodeListener } from 'h3'
import { cyan } from 'picocolors'
import { HOST, PORT } from '../constants'
import { logger } from '../logger'
import { createRouter } from './router'
import { websocketHandler } from './websockets'
import type { ASTExplorerServerOptions } from '@/index'

export async function createServer(options: ASTExplorerServerOptions) {
  const {
    host = HOST,
    port: _port = PORT,
    ...h3AppOptions
  } = options

  const app = createApp(h3AppOptions)
  const router = await createRouter()
  app
    .use(router)
    .use('/_ws', websocketHandler)

  const { handleUpgrade } = wsAdapter(app.websocket)
  const port = await detect({
    hostname: host,
    port: _port,
  })
  const address = `http://${host}:${port}`
  const server = createHttpServer(toNodeListener(app))
    .on('upgrade', handleUpgrade)
    .listen(port, host, () => {
      logger(`Server started listening on ${address}`)
      // eslint-disable-next-line no-console
      console.log(cyan(`rollup-plugin-ast-explorer-v${__ROLLUP_PLUGIN_AST_EXPLORER_VERSION__}: visit ${address} to explore the rollup's AST`))
    })

  server.address = () => address

  return server
}

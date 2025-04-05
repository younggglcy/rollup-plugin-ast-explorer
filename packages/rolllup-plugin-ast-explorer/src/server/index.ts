import type { ASTExplorerServerOptions } from '@/index'
import type { ModuleInfosMap } from '@/types'
import type { BehaviorSubject } from 'rxjs'
import { createServer as createHttpServer } from 'node:http'
import detect from 'detect-port'
import { createApp, toNodeListener } from 'h3'
import { cyan } from 'picocolors'
import { HOST, PORT } from '../constants'
import { logger } from '../logger'
import { createRouter } from './router'

export async function createServer(options: {
  serverOptions: ASTExplorerServerOptions
  modulesSource: BehaviorSubject<ModuleInfosMap>
}) {
  const {
    serverOptions: {
      host = HOST,
      port: _port = PORT,
      ...h3AppOptions
    },
    modulesSource,
  } = options

  const port = await detect({
    hostname: host,
    port: _port,
  })
  const address = `http://${host}:${port}`

  const app = createApp(h3AppOptions)
  const router = await createRouter({
    modulesSource,
  })
  app
    .use(router)

  const server = createHttpServer(toNodeListener(app))
    .listen(port, host, () => {
      logger(`Server started listening on ${address}`)
      // eslint-disable-next-line no-console
      console.log(cyan(`rollup-plugin-ast-explorer-v${__ROLLUP_PLUGIN_AST_EXPLORER_VERSION__}: visit ${address} to explore the rollup's AST`))
    })

  server.address = () => address

  return server
}

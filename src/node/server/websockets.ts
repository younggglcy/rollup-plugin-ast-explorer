import { defineWebSocketHandler } from 'h3'
import { logger } from '../logger'

export const websocketHandler = defineWebSocketHandler({
  open(peer) {
    logger('websocket open', peer)
  },

  close(peer, details) {
    logger('websocket close', peer, details)
  },

  error(peer, error) {
    logger('websocket error', peer, error)
  },

  message(peer, message) {

  },
})

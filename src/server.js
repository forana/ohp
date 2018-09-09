import 'colors'
import http from 'http'
import log from './log'
import httputil from './httputil'
import Handler from './handler'

class Server {
  constructor () {
    this.server = null
    this.root = null
  }

  setRoot (root) {
    this.root = root
    return this
  }

  serve (host, port) {
    let handler = null
    try {
      handler = new Handler(this.root)
    } catch (e) {
      log.critical(e.message)
      return
    }
    this.server = http.createServer()
    this.server.listen({
      host: host,
      port: port
    }, err => {
      // TODO what kind of errors actually make it to this?
      if (err) return console.log('ohp!', err)
      log.info(`ohp, listening on port ${host}:${port}`.bold)
    }).on('request', (req, resp) => {
      this.logRequest(req)
      resp.on('finish', () => { this.logResponse(req, resp) })
      try {
        handler.handleRequest(req, resp)
      } catch (e) {
        httputil.handleInternalError(req, resp, e)
      }
    }).on('error', e => {
      if (e && e.code === 'EADDRINUSE') {
        log.critical(`ohp, port ${port} is already in use`.red)
      }
    }).on('clientError', (e, sock) => {
      log.error(e)
      sock.close()
    })
  }

  stop () {
    return new Promise((resolve, reject) => {
      this.server.close(() => {
        log.info('ohp, server stopped'.bold)
        resolve()
      })
    })
  }

  logRequest (req) {
    const sourceIP = req.connection.remoteAddress
    const method = req.method
    const path = req.url
    log.info(`req:  ${sourceIP} - ${method} ${path}`)
  }

  logResponse (req, resp) {
    const sourceIP = req.connection.remoteAddress
    const method = req.method
    const path = req.url
    const status = resp.statusCode
    log.info(`resp: ${sourceIP} - ${method} ${path} - ${status}`)
  }
}

export default Server

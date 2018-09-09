import log from './log'

export default {
  handleInternalError (req, resp, e) {
    log.error(`Internal error: ${e.stack}`)
    if (!resp.headersSent) {
      resp.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      resp.write('ohp, internal server error\n')
    }
    resp.end()
  },
  basicError (resp, code, message) {
    resp.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' })
    resp.write(message + '\n')
    resp.end()
  }
}

import httputil from './httputil'
import DefaultRenderer from './renderer'

class DefaultHandler {
  constructor (root) {
    this.renderer = new DefaultRenderer(root)
  }

  handleRequest (req, resp) {
    if (!validMethod(req.method)) {
      httputil.basicError(resp, 405, `Method ${req.method} not allowed`)
      return
    }

    this.renderer.render(req, resp)
  }
}

function validMethod (method) {
  return ['GET', 'POST', 'PUT', 'DELETE'].indexOf(method) !== -1
}

export default DefaultHandler

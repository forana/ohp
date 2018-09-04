import http from 'http'

const handler = (req, resp) => {
  resp.end('ohp')
}

class Server {
  constructor () {
    this.server = null
  }

  serve (host, port) {
    this.server = http.createServer(handler)
    this.server.listen({
      host: host,
      port: port
    }, err => {
      if (err) return console.log('ohp!', err)
      console.log(`ohp, listening on port ${host}:${port}`.bold)
    })
  }

  stop () {
    return new Promise((resolve, reject) => {
      this.server.close(() => {
        console.log('server stopped'.bold)
        resolve()
      })
    })
  }
}

export default Server

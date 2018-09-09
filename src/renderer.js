import os from 'os'
import path from 'path'
import fs from 'fs'
import url from 'url'
import ejs from 'ejs'
import mime from 'mime-types'
import log from './log'
import httputil from './httputil'

class DefaultRenderer {
  constructor (root) {
    log.trace(`using default renderer`)
    let r = root
    if (r == null) {
      throw new Error('ohp, root directory can\'t be null')
    }
    if (r.startsWith('~')) {
      r = os.homedir() + r.substring(1)
    }
    r = path.resolve(r)
    try {
      fs.accessSync(r, fs.constants.R_OK)
    } catch (e) {
      throw new Error(`ohp, either ${this.root} doesn't exist, or I don't have permission to read it`)
    }
    this.root = r
    log.trace(`resolved absolute root to ${this.root}`)
  }

  render (req, resp) {
    const parsedURL = url.parse(req.url, true)
    this.findTemplate(path.resolve(this.root, '.' + parsedURL.pathname))
      .then(resolvedPath => {
        log.trace(`resolved ${req.url} -> ${resolvedPath}`)
        if (resolvedPath.endsWith('.ejs')) {
          this.renderEJS(req, resp, resolvedPath)
        } else {
          this.renderFile(req, resp, resolvedPath)
        }
      })
      .catch(e => {
        log.trace(e.stack)
        log.warning(`file not found: ${parsedURL.pathname}`)
        httputil.basicError(resp, 404, 'ohp, couldn\'t find that, sorry')
      })
  }

  findTemplate (requestPath) {
    return new Promise((resolve, reject) => {
      const possiblePaths = [
        requestPath,
        requestPath + '.ejs',
        requestPath + '/index.html.ejs',
        requestPath + '/index.ejs',
        requestPath + '/index.html'
      ]

      Promise.all(possiblePaths.map(p => this.fileExists(p)))
        .then(filePaths => {
          const resolvedPath = filePaths.reduce((path, current) => current || path)
          if (resolvedPath != null) {
            resolve(resolvedPath)
          } else {
            reject(new Error(`file not found: ${requestPath}`))
          }
        })
    })
  }

  fileExists (requestPath) {
    return new Promise((resolve, reject) => {
      fs.stat(requestPath, (err, stats) => {
        if (err != null || stats.isDirectory()) {
          resolve(null)
        } else {
          resolve(requestPath)
        }
      })
    })
  }

  renderEJS (req, resp, resolvedPath) {
    resp.setHeader('Content-Type', 'text/html; charset=utf-8')
    ejs.renderFile(resolvedPath, new RenderContext(req, resp), {
      filename: resolvedPath,
      async: true,
      rmWhitespace: true
    }, (err, p) => {
      if (err != null) {
        httputil.handleInternalError(req, resp, err)
      } else {
        p.then(output => {
          resp.writeHead(200, {})
          resp.write(output)
          resp.end()
        }).catch(e => httputil.handleInternalError(req, resp, e))
      }
    })
  }

  renderFile (req, resp, resolvedPath) {
    resp.writeHead(200, { 'Content-Type': mime.lookup(resolvedPath) })
    const rs = fs.createReadStream(resolvedPath)
    rs.on('close', () => { resp.end() })
    rs.pipe(resp)
  }
}

class RenderContext {
  constructor (req, resp) {
    this.req = req
    this.resp = resp
    this.log = log
  }

  require (module) {
    return require(module)
  }
}

export default DefaultRenderer

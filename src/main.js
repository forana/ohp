#!/usr/bin/env node

import prog from 'commander'
import version from './version'
import defaults from './defaults'
import log from './log'
import Server from './server'

// TODO this leaves the server running when exceptions aren't caught

// shut down the server nicely on SIGINT
// process.on('SIGINT', async () => {
//   log.trace('\nohp, just let me get out of your way, here')
//   await server.stop()
//   process.exit(0)
// })

prog
  .version(version)
  .description('a simple questionable web server')
  .arguments('<rootDir>')
  .option('-h, --host <host>', `The host to listen on (default = ${defaults.host})`)
  .option('-p, --port <port>', `The port to use (default = ${defaults.port})`)
  .option('-l, --log-level <level>', `The level at which to log. Acceptable values are trace, debug, info, warning, and error (default = ${defaults.logLevel})`)
  .option('--no-color', 'Disable color in logs')
  .parse(process.argv)

const logLevel = {
  'trace': log.TRACE,
  'debug': log.DEBUG,
  'info': log.INFO,
  'warning': log.WARNING,
  'error': log.ERROR
}[prog.logLevel || defaults.logLevel]
if (!logLevel) {
  log.critical(`Unknown log level "${prog.logLevel}"`)
  process.exit(1)
}
log.setLogLevel(logLevel)

let dir = '.'
if (prog.args.length === 1) {
  dir = prog.args[0]
} else if (prog.args.length > 1) {
  log.critical(`uh hey there, I only expected one directory to serve from, but you gave me ${prog.args.length}`)
  process.exit(1)
}
log.trace(`setting root = ${dir}`)

const host = prog.host || defaults.host
const port = prog.port || defaults.port

try {
  new Server()
    .setRoot(dir)
    .serve(host, port)
} catch (e) {
  log.critical(e)
}

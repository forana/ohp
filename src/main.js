#!/usr/bin/env node

import 'colors'
import prog from 'commander'
import version from './version'
import defaults from './defaults'
import Server from './server'

// shut down the server nicely on SIGINT
process.on('SIGINT', async () => {
  console.log('\nohp, just let me get out of your way, here'.gray)
  await server.stop()
  process.exit(0)
})

prog
  .version(version)
  .description('a simple questionable web server')
  .arguments('<rootDir>')
  .option('-h, --host <host>', `The host to listen on (default = ${defaults.host})`)
  .option('-p, --port <port>', `The port to use (default = ${defaults.port})`)
  .parse(process.argv)

const server = new Server()
server.serve(prog.host || defaults.host, prog.port || defaults.port)

import colors from 'colors'
import moment from 'moment'

const TRACE = 1
const DEBUG = 2
const INFO = 3
const WARNING = 4
const ERROR = 5

let logLevel = INFO

function writeMessage (message, ...colorFuncs) {
  colorFuncs.forEach(f => { message = f(message) })
  const ds = moment().format()
  console.log(`${ds} ${message}`)
}

export default {
  TRACE,
  DEBUG,
  INFO,
  WARNING,
  ERROR,
  setLogLevel (level) {
    logLevel = level
  },
  trace (message) {
    if (logLevel <= TRACE) {
      writeMessage(message, colors.gray)
    }
  },
  debug (message) {
    if (logLevel <= DEBUG) {
      writeMessage(message, colors.cyan)
    }
  },
  info (message) {
    if (logLevel <= INFO) {
      writeMessage(message, colors.white)
    }
  },
  warning (message) {
    if (logLevel <= WARNING) {
      writeMessage(message, colors.yellow)
    }
  },
  error (message) {
    if (logLevel <= ERROR) {
      writeMessage(message, colors.red)
    }
  },
  critical (message) {
    writeMessage(message, colors.red, colors.bold)
  }
}

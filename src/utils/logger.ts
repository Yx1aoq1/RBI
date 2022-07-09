import dayjs from 'dayjs'
import { CONSOLE_ENABLE } from '@/config'
interface LogLevel {
  levelStyle: string
  dateStyle: string
  infoStyle: string
  lineStyle: string
  level: number
  name: string
}

const levels = {
  trace: {
    levelStyle: 'color: #9254de',
    dateStyle: 'color: #7cb305',
    lineStyle: 'color: #141414',
    infoStyle: 'color: #141414',
    level: 0,
    name: 'trace',
  },
  info: {
    levelStyle: 'color: #096dd9',
    dateStyle: 'color: #7cb305',
    lineStyle: 'color: #141414',
    infoStyle: 'color: #141414',
    level: 2,
    name: 'info',
  },
  warn: {
    levelStyle: 'color: #fa8c16',
    dateStyle: 'color: #7cb305',
    lineStyle: 'color: #141414',
    infoStyle: 'color: #141414',
    level: 3,
    name: 'warn',
  },
  error: {
    levelStyle: 'color: #f5222d',
    dateStyle: 'color: #7cb305',
    lineStyle: 'color: #141414',
    infoStyle: 'color: #141414',
    level: 4,
    name: 'error',
  },
}

class Logger {
  dateformat: string
  levels = levels
  useLevel = levels.info
  constructor(dateformat?: string) {
    this.dateformat = dateformat || 'YYYY-MM-DD HH:mm:ss:SSS'
  }

  print(level: LogLevel, msg: string, ...params: unknown[]) {
    if (!CONSOLE_ENABLE) return
    if (level.level < this.useLevel.level) {
      return
    }
    let infoArg = []
    for (let i = 2; i < arguments.length; i++) {
      infoArg = arguments[i]
    }
    const fullMsg = `%c[${dayjs().format(this.dateformat)}]%c[${level.name}]%c >>> %c${msg}`
    console.info(fullMsg, level.dateStyle, level.levelStyle, level.lineStyle, level.infoStyle, ...params)
  }

  trace(msg: string, ...params: unknown[]) {
    this.print(this.levels.trace, msg, ...params)
  }

  info(msg: string, ...params: unknown[]) {
    this.print(this.levels.info, msg, ...params)
  }

  warn(msg: string, ...params: unknown[]) {
    this.print(this.levels.warn, msg, ...params)
  }

  error(msg: string, ...params: unknown[]) {
    this.print(this.levels.error, msg, ...params)
  }
}

export default new Logger()

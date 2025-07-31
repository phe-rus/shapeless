import chalk from "chalk"

type LogLevel = 'error' | 'warn' | 'info' | 'success'

const logWithTimestamp = (level: LogLevel, ...args: unknown[]): void => {
  const timestamp = new Date().toISOString().split('T')[1]?.split('.')[0]
  const prefix = `[${timestamp}]`

  const colorMap = {
    error: chalk.red,
    warn: chalk.yellow,
    info: chalk.cyan,
    success: chalk.green,
  }

  console.log(colorMap[level](prefix), ...args)
}

export const logger = {
  error: (...args: unknown[]) => logWithTimestamp('error', ...args),
  warn: (...args: unknown[]) => logWithTimestamp('warn', ...args),
  info: (...args: unknown[]) => logWithTimestamp('info', ...args),
  success: (...args: unknown[]) => logWithTimestamp('success', ...args),
}
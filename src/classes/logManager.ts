import { ThemeColor } from 'src/classes/theme'

type LogEntry = {
    msg: string
    color?: ThemeColor
}

class LogManager {
    private log: LogEntry[] = []

    addLog = (log: LogEntry) => this.log.push(log)
    getLogs = (num: number = 0): LogEntry[] => this.log.slice(num * -1)
}

export default LogManager

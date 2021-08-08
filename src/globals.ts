import Camera from 'src/classes/camera'
import EventManager from 'src/classes/eventManager'
import Input from 'src/classes/input'
import LogManager from 'src/classes/logManager'
import ThemeManager from 'src/classes/theme'

// Global Camera class
export const CAMERA = new Camera()

// Global input class
export const INPUT = new Input()

// Global Theme Manager
export const THEME_MANAGER = new ThemeManager()

// Global Log Manager
export const LOG_MANAGER = new LogManager()

// Event Manager
export const EVENT_MANAGER = new EventManager()

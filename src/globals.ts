import Camera from 'src/classes/camera'
import EffectManager from 'src/classes/effectManager'
import EventManager from 'src/classes/eventManager'
import InputManager from 'src/classes/input'
import LogManager from 'src/classes/logManager'
import Menu from 'src/classes/menu'
import ThemeManager from 'src/classes/theme'

// Global Camera class
export const CAMERA = new Camera()

// Global Input Manager
export const INPUT = new InputManager()

// Global Theme Manager
export const THEME_MANAGER = new ThemeManager()

// Global Log Manager
export const LOG_MANAGER = new LogManager()

// Event Manager
export const EVENT_MANAGER = new EventManager()

// Effect Manager
export const EFFECT_MANAGER = new EffectManager()

// Menu
export const MENU = new Menu({ effectManager: EFFECT_MANAGER, themeManager: THEME_MANAGER })

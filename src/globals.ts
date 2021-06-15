import Input from './input'
import ThemeManager from './theme'

// Canvas globals
export const CNV = document.getElementById('cnv') as HTMLCanvasElement
export const CTX = CNV.getContext('2d') as CanvasRenderingContext2D
export const CONTAINER = document.getElementById('cnvContainer') as HTMLDivElement

// Global input class
export const INPUT = new Input()

// Global Theme Manager
export const THEME_MANAGER = new ThemeManager()

import Input from './input'
import Player from './player'
import ThemeManager from './theme'
import { GRID_SIZE } from './constants'

// Canvas globals
export const CNV = document.getElementById('cnv') as HTMLCanvasElement
export const CTX = CNV.getContext('2d') as CanvasRenderingContext2D
export const CONTAINER = document.getElementById('cnvContainer') as HTMLDivElement

// Global input class
export const INPUT = new Input()

// Global Theme Manager
export const THEME_MANAGER = new ThemeManager()

export const PLAYER = new Player({
    position: { x: 2 * GRID_SIZE, y: 4 * GRID_SIZE },
    char: '@',
})

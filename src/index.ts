import { InputEvent, InputObserver } from 'src/classes/input'
import Map from 'src/classes/map'
import Player from 'src/classes/entities/player'
import { THEME_COLOR } from 'src/classes/theme'
import { CNV, CTX, CHARS, GRID_PAD, GRID_SIZE } from 'src/core/constants'
import mapData from 'src/core/mapData'
import { Vector2 } from 'src/core/types'
import { INPUT, THEME_MANAGER } from 'src/globals'

const PLAYER = new Player({ position: new Vector2(3, 3) })
const MAP = new Map(mapData[0])

// draw background
const drawBackground = () => {
    CTX.fillStyle = THEME_MANAGER.getColors().background
    CTX.fillRect(0, 0, CNV.width, CNV.height)
}

// Draw dot grid
const drawDotGrid = (gridSize = GRID_SIZE) => {
    for (let i = GRID_PAD; i <= CNV.width - GRID_PAD; i += gridSize) {
        for (let j = GRID_PAD; j <= CNV.height - GRID_PAD; j += gridSize) {
            CTX.fillStyle = THEME_MANAGER.getColors()[THEME_COLOR.LOW]
            CTX.font = `${gridSize}px Andale Mono`
            CTX.textAlign = 'center'
            CTX.textBaseline = 'middle'
            CTX.fillText(CHARS.DOT, i, j)
        }
    }
}

// Draw grid lines
const drawGrid = (gridSize = GRID_SIZE) => {
    CTX.lineWidth = 2
    CTX.strokeStyle = THEME_MANAGER.getColors().low

    // vertical lines
    for (let i = gridSize; i < CNV.width; i += gridSize) {
        CTX.beginPath()
        CTX.lineTo(i, 0)
        CTX.lineTo(i, CNV.height)
        CTX.stroke()
    }

    // horizontal lines
    for (let i = gridSize; i < CNV.height; i += gridSize) {
        CTX.beginPath()
        CTX.lineTo(0, i)
        CTX.lineTo(CNV.width, i)
        CTX.stroke()
    }
}

const draw = () => {
    drawBackground()
    drawDotGrid()
    MAP.draw()
    PLAYER.draw()
}

class InputWatcher implements InputObserver {
    readonly id = 'inputWatcher1'

    update = (event: InputEvent) => {
        PLAYER.update(event, MAP)
        draw()
    }
}

const inputWatcher = new InputWatcher()
INPUT.subscribe(inputWatcher)
INPUT.listen()

// Initial Draw
draw()

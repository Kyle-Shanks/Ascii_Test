import { CHARS, GRID_SIZE } from './constants'
import { CNV, CTX, INPUT, PLAYER, THEME_MANAGER } from './globals'
import { InputEvent, InputObserver } from './input'
import Entity from './entity'
import { THEME_COLOR } from './theme'

// draw background
const drawBackground = () => {
    CTX.fillStyle = THEME_MANAGER.getColors().background
    CTX.fillRect(0, 0, CNV.width, CNV.height)
}

// draw test dot grid from Entity
// const drawDotGrid = (gridSize = GRID_SIZE) => {
//     for (let i = (gridSize / 2); i < CNV.width; i += gridSize) {
//         for (let j = (gridSize / 2); j < CNV.height; j += gridSize) {
//             const entity = new Entity({
//                 position: { x: i, y: j },
//                 char: CHARS.DOT,
//                 color: THEME_COLOR.LOW
//             })
//             entity.draw()
//         }
//     }
// }
const drawDotGrid = (gridSize = GRID_SIZE) => {
    for (let i = gridSize; i < CNV.width; i += gridSize) {
        for (let j = gridSize; j < CNV.height; j += gridSize) {
            const entity = new Entity({
                position: { x: i, y: j },
                char: CHARS.DOT,
                color: THEME_COLOR.LOW
            })
            entity.draw()
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
    drawGrid(GRID_SIZE)
    drawDotGrid(GRID_SIZE)

    // PLAYER.handleInput(INPUT.getKeys())
    PLAYER.updatePosition()
    PLAYER.draw()

    requestAnimationFrame(draw)
}

// draw()

// -------------------------------------------------------

class InputWatcher implements InputObserver {
    readonly id = 'inputWatcher1'

    update = (event: InputEvent) => {
        // console.log({ event, keys: INPUT.getKeys() })

        drawBackground()
        drawDotGrid(GRID_SIZE)

        PLAYER.handleInput(event)
        PLAYER.updatePosition()
        PLAYER.draw()
    }
}

const inputWatcher = new InputWatcher()
INPUT.subscribe(inputWatcher)
INPUT.listen()

drawBackground()
drawDotGrid(GRID_SIZE)
PLAYER.draw()

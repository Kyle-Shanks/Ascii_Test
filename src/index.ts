import { CNV, CTX, INPUT, THEME_MANAGER } from './globals'
import Text from './text'

const dot = '·'

console.log({
    CNV,
    colors: THEME_MANAGER.getColors()
})

INPUT.listen()

// draw test dot grid from Text
const drawDotGrid = (size = 50) => {
    for (let i = (size / 2); i < CNV.width; i += size) {
        for (let j = (size / 2); j < CNV.height; j += size) {
            const text = new Text({
                pos: { x: i, y: j },
                msg: dot,
                size: size
            })
            text.draw()
        }
    }
}

const drawGrid = (gridSize = 50) => {
    CTX.lineWidth = 4
    CTX.strokeStyle = '#aaaaaa'

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

const testSize = 50

drawGrid(testSize)
drawDotGrid(testSize)

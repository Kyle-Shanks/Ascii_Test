import { CNV, CTX } from './globals'
import THEME from './theme'
import Text from './text'
import Input from './input'

const dot = '·'

console.log({
    CNV,
    dark: THEME['Dark']
})

const INPUT = new Input()
INPUT.listen()

// draw test dot grid from Text
for (let i = 50; i < CNV.width; i += 100 ) {
    for (let j = 50; j < CNV.height; j += 100) {
        const text = new Text({
            pos: { x: i, y: j },
            msg: dot,
            size: 100
        })
        text.draw()
    }
}

const drawGrid = (gridSize = 100) => {
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

drawGrid()

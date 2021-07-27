import { InputEvent, InputObserver } from 'src/classes/input'
import Map from 'src/classes/map'
import Player from 'src/classes/entities/player'
import { THEME_COLOR } from 'src/classes/theme'
import { CNV, CTX, CHARS, GRID_PAD, GRID_SIZE } from 'src/core/constants'
import mapData from 'src/core/mapData'
import { Vector2 } from 'src/core/types'
import { CAMERA, INPUT, THEME_MANAGER } from 'src/globals'

const MAP = new Map(mapData[0])
const PLAYER = new Player({ position: MAP.startPosition})

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

// Calculate light at a position
const calculateLight = (pos: Vector2, strength: number): Record<string, boolean> => {
    const posArr = pos.getWithinDistance(strength)
    const lightMap: Record<string, boolean> = {}

    posArr.forEach((vec) => {
        let start = pos
        const dx = Math.abs(vec.x - start.x)
        const dy = Math.abs(vec.y - start.y)
        const sx = start.x < vec.x ? Vector2.RIGHT : Vector2.LEFT
        const sy = start.y < vec.y ? Vector2.DOWN : Vector2.UP

        let err = dx - dy

        while (true) {
            if (!lightMap[`${start.x},${start.y}`] && !MAP.isPositionOutsideMap(start)) {
                lightMap[`${start.x},${start.y}`] = true
            }

            const entityAtPosition = MAP.getAtPosition(start)
            if (entityAtPosition !== null && entityAtPosition.isOpaque()) break
            if (start.isEqual(vec)) break

            const err2 = err * 2

            if (err2 > -dy) {
                err -= dy
                start = start.add(sx)
            }
            if (err2 < dx) {
                err += dx
                start = start.add(sy)
            }
        }
    })

    return lightMap
}

// TODO: Create type for LightMap
const drawLight = (lightMap: Record<string, boolean>) => {
    const positions = Object.keys(lightMap).map((str) => {
        const [x,y] = str.split(',')
        return new Vector2(Number(x), Number(y))
    })

    positions.forEach((pos) => {
        const rectPos = pos.multiply(GRID_SIZE).subtract(CAMERA.absPosition)
        CTX.fillStyle = `rgba(255,255,255,0.03)`
        CTX.fillRect(rectPos.x + GRID_SIZE / 2, rectPos.y + GRID_SIZE / 2, GRID_SIZE, GRID_SIZE)
    })
}

const cameraOffset = new Vector2(19, 14)
let lightMap = {}

const draw = () => {
    drawBackground()
    drawLight(lightMap)
    MAP.draw(lightMap)
    PLAYER.draw()
}

class InputWatcher implements InputObserver {
    readonly id = 'inputWatcher1'

    update = (event: InputEvent) => {
        PLAYER.update(event, MAP)
        if (event.type === 'press') {
            CAMERA.setPosition(PLAYER.position.subtract(cameraOffset))
            lightMap = calculateLight(PLAYER.position, 7.5)
        }
    }
}

const inputWatcher = new InputWatcher()
INPUT.subscribe(inputWatcher)
INPUT.listen()

const init = () => {
    CAMERA.setPosition(PLAYER.position.subtract(cameraOffset))
    lightMap = calculateLight(PLAYER.position, 7.5)
    frame()
}

const frame = () => {
    CAMERA.update()
    draw()
    requestAnimationFrame(frame)
}

// Go Time
init()

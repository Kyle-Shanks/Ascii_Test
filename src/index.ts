import { InputEvent, InputObserver } from 'src/classes/input'
import Map from 'src/classes/map'
import Enemy from 'src/classes/entities/enemy'
import Player from 'src/classes/entities/player'
import { THEME_COLOR } from 'src/classes/theme'
import { CNV, CTX, CHARS, GRID_PAD, GRID_SIZE, ENTITY_TYPES } from 'src/core/constants'
import { enemyStatsMap } from 'src/core/enemyData'
import mapData from 'src/core/mapData'
import { Vector2 } from 'src/core/types'
import { CAMERA, INPUT, LOG_MANAGER, THEME_MANAGER } from 'src/globals'

let lightMap: Record<string, boolean> = {}
let currentMap: number = 0
let MAP: Map = new Map(mapData[currentMap])
let enemies: Enemy[] = mapData[currentMap].enemies.map((info) => (
    new Enemy(
        {...info, ...enemyStatsMap[info.enemyType]},
        LOG_MANAGER,
    )
))

const PLAYER = new Player(
    {
        position: MAP.startPosition,
        stats: {
            HP: 4,
            ACC: 85,
            STR: 1,
            DEF: 0,
            SPD: 1,
        }
    },
    LOG_MANAGER,
)

// Level functions
const setLevel = (mapId: number) => {
    if (mapId === currentMap) {
        PLAYER.setPosition(MAP.startPosition)
        CAMERA.setPosition(PLAYER.position)
    } else {
        lightMap = {}
        currentMap = mapId
        MAP = new Map(mapData[currentMap])
        enemies = mapData[currentMap].enemies.map((info) => (
            new Enemy(
                { ...info, ...enemyStatsMap[info.enemyType] },
                LOG_MANAGER,
            )
        ))
        PLAYER.setPosition(MAP.startPosition)
        CAMERA.resetPosition(PLAYER.position.subtract(new Vector2(0, 4))) // Fade in effect
        CAMERA.setPosition(PLAYER.position)
        LOG_MANAGER.addLog({ msg: `Now Entering: ${MAP.title}` })
    }

    lightMap = calculateLight(PLAYER.position, 7.5)
}

// const prevLevel = () => setLevel(currentMap - 1) // Don't think I'll need this
const resetLevel = () => setLevel(currentMap)
const nextLevel = () => setLevel(currentMap + 1)

// Draw functions
const drawBackground = () => {
    CTX.fillStyle = THEME_MANAGER.getColors().background
    CTX.fillRect(0, 0, CNV.width, CNV.height)
}

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

const drawEnemies = () => {
    enemies.forEach((enemy) => {
        const key = `${enemy.position.x},${enemy.position.y}`
        if (lightMap[key]) enemy.draw()
    })
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
            if (entityAtPosition?.isOpaque()) break
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
        const [x, y] = str.split(',')
        return new Vector2(Number(x), Number(y))
    })

    positions.forEach((pos) => {
        const rectPos = pos.multiply(GRID_SIZE).subtract(CAMERA.absPosition)
        CTX.fillStyle = `rgba(255,255,255,0.03)`
        CTX.fillRect(rectPos.x + GRID_SIZE / 2, rectPos.y + GRID_SIZE / 2, GRID_SIZE, GRID_SIZE)
    })
}

const drawUI = () => {
    CTX.fillStyle = THEME_MANAGER.getColors().low
    CTX.fillRect(0, CNV.height - 80, CNV.width, 80)

    // Draw the map and user info
    CTX.fillStyle = THEME_MANAGER.getColors().high
    CTX.font = `24px Andale Mono`
    CTX.textAlign = 'left'
    CTX.textBaseline = 'middle'

    CTX.fillText(`Map: ${MAP.title}`, CNV.width / 2 + 180, CNV.height - 25)
    CTX.fillStyle = THEME_MANAGER.getColors().danger
    CTX.fillText(`HP: ${PLAYER.health}/${PLAYER.stats.HP}`, CNV.width / 2 + 180, CNV.height - 55)

    CTX.fillStyle = THEME_MANAGER.getColors().accent
    CTX.fillText(`Keys: ${PLAYER.inventory.Key}`, CNV.width / 2 + 30, CNV.height - 55)
    CTX.fillText(`Gold: ${PLAYER.inventory.Gold}`, CNV.width / 2 + 30, CNV.height - 25)

    // Draw the Logs
    const lastTwo = LOG_MANAGER.getLogs(2)

    for (let i = 0; i < lastTwo.length; i++) {
        CTX.fillStyle = THEME_MANAGER.getColors()[lastTwo[i].color || 'high']
        CTX.fillText(lastTwo[i].msg, 30, CNV.height - (i ? 25 : 55))
    }
}

const draw = () => {
    drawBackground()
    drawLight(lightMap)
    MAP.draw(lightMap)
    drawEnemies()
    PLAYER.draw()
    drawUI()
}

class InputWatcher implements InputObserver {
    readonly id = 'inputWatcher1'

    update = (event: InputEvent) => {
        PLAYER.handleInput(event, MAP, enemies)
        // TODO: Check if player if alive here

        if (event.type === 'press') {
            // TODO: Add something to keep track of if the player moved

            const deadEnemyArr: number[] = []
            enemies.forEach((enemy, idx) => {
                if (enemy.health === 0) {
                    LOG_MANAGER.addLog({ msg: `${enemy.enemyType} died.` })
                    deadEnemyArr.push(idx)
                }
            })
            enemies = enemies.filter((_, idx) => !deadEnemyArr.includes(idx))

            // Check if the player is standing on a portal
            const entityAtPosition = MAP.getAtPosition(PLAYER.position)
            if (entityAtPosition?.type === ENTITY_TYPES.PORTAL) return nextLevel()

            enemies.forEach((enemy) => enemy.update(MAP, PLAYER, enemies))

            // Update camera and recalculate light
            CAMERA.setPosition(PLAYER.position)
            lightMap = calculateLight(PLAYER.position, 7.5)
        }
    }
}

const inputWatcher = new InputWatcher()
INPUT.subscribe(inputWatcher)
INPUT.listen()

const init = () => {
    setLevel(0)
    LOG_MANAGER.addLog({ msg: `Welcome to the Dungeon` })
    frame()
}

const frame = () => {
    CAMERA.update()
    draw()
    requestAnimationFrame(frame)
}

// - Go Time -
init()

import { InputEvent, InputObserver } from 'src/classes/input'
import Map from 'src/classes/map'
import Enemy from 'src/classes/entities/enemy'
import { GAME_EVENT_TYPE } from 'src/classes/eventManager'
import Player from 'src/classes/entities/player'
import { THEME_COLOR } from 'src/classes/theme'
import { CNV, CTX, CHARS, GRID_PAD, GRID_SIZE, ENTITY_TYPES } from 'src/core/constants'
import { enemyStatsMap } from 'src/core/enemyData'
import mapData from 'src/core/mapData'
import { Vector2 } from 'src/core/types'
import { CAMERA, EVENT_MANAGER, INPUT, LOG_MANAGER, THEME_MANAGER } from 'src/globals'

let lightMap: Record<string, boolean> = {}
let currentMap: number = 0
let MAP: Map = new Map(mapData[currentMap])
let enemies: Enemy[] = mapData[currentMap].enemies.map((info) => (
    new Enemy(
        {...info, ...enemyStatsMap[info.enemyType]},
        LOG_MANAGER,
        EVENT_MANAGER,
    )
))

const PLAYER = new Player(
    {
        position: MAP.startPosition,
        vision: 7.5,
        stats: {
            HP: 10,
            STR: 3,
            DEF: 0,
            ACC: 85,
        }
    },
    LOG_MANAGER,
    EVENT_MANAGER,
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
                EVENT_MANAGER,
            )
        ))
        PLAYER.setPosition(MAP.startPosition)
        CAMERA.resetPosition(PLAYER.position.subtract(new Vector2(0, 4))) // Fade in effect
        CAMERA.setPosition(PLAYER.position)
        LOG_MANAGER.addLog({ msg: `Now Entering: ${MAP.title}` })
    }

    lightMap = calculateLight(PLAYER.position, PLAYER.vision)
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
            const withinDistance = start.distanceTo(pos) <= strength
            if (
                !lightMap[start.toString()]
                && withinDistance
                && !MAP.isPositionOutsideMap(start)
            ) {
                lightMap[start.toString()] = true
            }

            if (start.isEqual(vec) || !withinDistance) break
            const entityAtPosition = MAP.getAtPosition(start)
            if (entityAtPosition?.isOpaque()) break

            if (err * 2 > -dy) {
                err -= dy
                start = start.add(sx)
            }
            if (err * 2 < dx) {
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
    MAP.draw(lightMap)
    enemies.forEach((enemy) => {
        if (lightMap[enemy.position.toString()]) enemy.draw()
    })
    PLAYER.draw()
    drawLight(lightMap)
    // drawUI()
}

// Watch Input
class InputWatcher implements InputObserver {
    readonly id = 'inputWatcher1'

    update = (event: InputEvent) => {
        PLAYER.handleInput(event, MAP, enemies)
    }
}

const inputWatcher = new InputWatcher()
INPUT.subscribe(inputWatcher)
INPUT.listen()

// Handler game events
const checkForDeadEnemies = () => {
    const deadEnemyArr: number[] = []
    enemies.forEach((enemy, idx) => {
        if (enemy.health === 0) {
            LOG_MANAGER.addLog({ msg: `${enemy.enemyType} died.` })
            deadEnemyArr.push(idx)
        }
    })
    enemies = enemies.filter((_, idx) => !deadEnemyArr.includes(idx))
}

const onPlayerAction = () => {
    // Have enemies move
    enemies.forEach((enemy) => enemy.update(MAP, PLAYER, enemies))

    // Recalculate light
    lightMap = calculateLight(PLAYER.position, PLAYER.vision)
}

const onPlayerMove = () => {
    checkForDeadEnemies()

    // Check if the player is standing on a portal
    const entityAtPosition = MAP.getAtPosition(PLAYER.position)
    if (entityAtPosition?.type === ENTITY_TYPES.PORTAL) return nextLevel()

    // Update camera
    CAMERA.setPosition(PLAYER.position)

    onPlayerAction()
}

const onPlayerDamaged = () => {
    CAMERA.shake()

    // TODO: Check if player if alive here
}

// Initialize function
const init = () => {
    setLevel(0)
    EVENT_MANAGER.addHandler({
        type: GAME_EVENT_TYPE.PLAYER_DAMAGED,
        func: onPlayerDamaged,
    })
    EVENT_MANAGER.addHandler({
        type: GAME_EVENT_TYPE.PLAYER_MOVE,
        func: onPlayerMove,
    })
    EVENT_MANAGER.addHandler({
        type: GAME_EVENT_TYPE.PLAYER_ACTION,
        func: onPlayerAction,
    })
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

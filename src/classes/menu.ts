import { CNV, CTX, GRID_SIZE } from 'src/core/constants'
import { MAP_NUM, MAP_SIZE, MapSize } from 'src/core/mapData'
import { Vector2 } from 'src/core/types'
import EffectManager, { EFFECT } from 'src/classes/effectManager'
import Player from 'src/classes/entities/player'
import { InputEvent } from 'src/classes/input'
import Map from 'src/classes/map'
import ThemeManager, { THEME } from 'src/classes/theme'

type MenuProps = {
    effectManager: EffectManager
    themeManager: ThemeManager
}

type MenuOption = {
    title: string
    getValue: Function
    next: Function
    prev: Function
    select: Function
}

const themeArr = Object.values(THEME)
const effectArr = Object.values(EFFECT)

class Menu {
    readonly height: number
    readonly width: number
    readonly borderSize: number
    readonly optionSpacing: number
    readonly headerSpacing: number
    readonly position: Vector2

    readonly miniMapHeight: number
    readonly miniMapWidth: number
    readonly miniMapPosition: Vector2

    private effectManager: EffectManager
    private themeManager: ThemeManager

    private cursorIndex: number
    private options: MenuOption[]

    constructor(props: MenuProps) {
        this.themeManager = props.themeManager
        this.effectManager = props.effectManager

        this.cursorIndex = 0
        this.options = [
            {
                title: 'Theme',
                getValue: this.themeManager.getTheme,
                next: this.nextTheme,
                prev: this.prevTheme,
                select: this.nextTheme
            },
            {
                title: 'FX',
                getValue: this.effectManager.getEffect,
                next: this.nextEffect,
                prev: this.prevEffect,
                select: this.nextEffect
            },
        ]

        this.borderSize = 14
        this.optionSpacing = 100
        this.headerSpacing = 70
        this.height = 20 + (this.borderSize * 2) + this.headerSpacing + (this.options.length * this.optionSpacing)
        this.width = 300 + (this.borderSize * 2)
        // this.position = new Vector2(
        //     (CNV.width - this.width) / 2,
        //     (CNV.height - this.height) / 2
        // )
        this.position = new Vector2(GRID_SIZE, GRID_SIZE)

        this.miniMapHeight = CNV.height - GRID_SIZE * 5
        this.miniMapWidth = CNV.width - (GRID_SIZE * 3 + this.width)
        this.miniMapPosition = new Vector2(GRID_SIZE * 2 + this.width, GRID_SIZE)
    }

    handleInput = (event: InputEvent) => {
        if (event.type === 'press') {
            switch (event.key) {
                case 'W': return this.cursorUp()
                case 'A': return this.options[this.cursorIndex].prev()
                case 'S': return this.cursorDown()
                case 'D': return this.options[this.cursorIndex].next()
                case 'J': return this.options[this.cursorIndex].select()
            }
        }
    }

    draw = () => {
        // Border
        CTX.fillStyle = this.themeManager.getColors().high
        CTX.fillRect(this.position.x, this.position.y, this.width, this.height)

        // Background
        CTX.fillStyle = this.themeManager.getColors().low
        CTX.fillRect(
            this.position.x + this.borderSize,
            this.position.y + this.borderSize,
            this.width - this.borderSize * 2,
            this.height - this.borderSize * 2,
        )

        // Draw command text
        CTX.fillStyle = this.themeManager.getColors().low
        CTX.fillRect(
            this.position.x + this.width / 2 - 60,
            this.position.y + this.height - this.borderSize,
            120,
            this.borderSize,
        )

        CTX.font = `20px Andale Mono`
        CTX.textAlign = 'center'
        CTX.textBaseline = 'middle'
        CTX.fillStyle = this.themeManager.getColors().accent
        CTX.fillText(
            '[ space ]',
            this.position.x + this.width / 2,
            this.position.y + this.height - 10
        )

        // Draw Header
        CTX.font = `28px Andale Mono`

        CTX.fillText(
            '- Menu -',
            this.position.x + this.width / 2,
            this.position.y + this.borderSize + this.headerSpacing / 2
        )

        // Draw options
        CTX.textAlign = 'left'

        this.options.forEach((option, idx) => {
            // Title
            CTX.fillStyle = this.themeManager.getColors().accent
            CTX.fillText(
                option.title,
                this.position.x + this.borderSize + 45,
                this.position.y + this.borderSize + this.headerSpacing + 20 + (idx * this.optionSpacing)
            )
            // Value
            CTX.fillStyle = this.themeManager.getColors().high
            CTX.fillText(
                option.getValue(),
                this.position.x + this.borderSize + 85,
                this.position.y + this.borderSize + this.headerSpacing + 60 + (idx * this.optionSpacing)
            )
        })

        // Draw cursor
        CTX.fillRect(
            this.position.x + this.borderSize + 22,
            this.position.y + this.borderSize + this.headerSpacing + 11 + (this.cursorIndex * this.optionSpacing),
            12.5,
            12.5
        )
    }

    drawMiniMap = (map: Map, player: Player) => {
        // Border
        CTX.fillStyle = this.themeManager.getColors().high
        CTX.fillRect(this.miniMapPosition.x, this.miniMapPosition.y, this.miniMapWidth, this.miniMapHeight)

        // Background
        CTX.fillStyle = this.themeManager.getColors().background
        CTX.fillRect(
            this.miniMapPosition.x + this.borderSize,
            this.miniMapPosition.y + this.borderSize,
            this.miniMapWidth - this.borderSize * 2,
            this.miniMapHeight - this.borderSize * 2,
        )

        const miniMapSizes: Record<MapSize, number> = {
            [MAP_SIZE.XS]: 28,
            [MAP_SIZE.S]: 20,
            [MAP_SIZE.M]: 14,
            [MAP_SIZE.L]: 10,
            [MAP_SIZE.XL]: 7, // Or 7.5
            [MAP_SIZE.XXL]: 5
        }

        const mapPos = this.miniMapPosition.add(new Vector2(GRID_SIZE * 1.5, GRID_SIZE * 1.5))
        const miniMapSize = miniMapSizes[map.size]

        // Draw visible map
        map.data.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === null) return
                // TODO: If player doesn't have in game map
                // if (!map.seenMap[`${x},${y}`]) return

                // Draw everything
                switch (cell) {
                    case MAP_NUM.WALL:
                        CTX.fillStyle = this.themeManager.getColors().high
                        break
                    case MAP_NUM.GATE:
                    case MAP_NUM.DOOR:
                    case MAP_NUM.PORTAL:
                    case MAP_NUM.POTION:
                    case MAP_NUM.KEY:
                        CTX.fillStyle = this.themeManager.getColors().accent
                        break
                    default:
                        CTX.fillStyle = this.themeManager.getColors().background
                }

                if (!map.seenMap[`${x},${y}`]) {
                    if (cell !== MAP_NUM.WALL && cell !== MAP_NUM.DOOR && cell !== MAP_NUM.GATE) return
                    CTX.fillStyle = this.themeManager.getColors().low
                }

                CTX.fillRect(
                    mapPos.x + x * miniMapSize,
                    mapPos.y + y * miniMapSize,
                    miniMapSize,
                    miniMapSize,
                )
            })
        })

        // Draw player position
        CTX.fillStyle = this.themeManager.getColors().pop
        CTX.fillRect(
            mapPos.x + player.position.x * miniMapSize,
            mapPos.y + player.position.y * miniMapSize,
            miniMapSize,
            miniMapSize,
        )
    }

    private cursorUp = () => {
        if (this.cursorIndex > 0) this.cursorIndex--
    }
    private cursorDown = () => {
        if (this.cursorIndex < this.options.length - 1) this.cursorIndex++
    }

    private nextTheme = () => {
        const idx = themeArr.indexOf(this.themeManager.getTheme())
        this.themeManager.setTheme(themeArr[(idx + 1) % themeArr.length])
    }
    private prevTheme = () => {
        const idx = themeArr.indexOf(this.themeManager.getTheme())
        const newIdx = idx === 0 ? themeArr.length - 1 : idx - 1
        this.themeManager.setTheme(themeArr[newIdx])
    }

    private nextEffect = () => {
        const idx = effectArr.indexOf(this.effectManager.getEffect())
        this.effectManager.setEffect(effectArr[(idx + 1) % effectArr.length])
    }
    private prevEffect = () => {
        const idx = effectArr.indexOf(this.effectManager.getEffect())
        const newIdx = idx === 0 ? effectArr.length - 1 : idx - 1
        this.effectManager.setEffect(effectArr[newIdx])
    }
}

export default Menu

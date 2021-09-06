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

const statMap = [
    (p: Player) => `LVL: ${p.level}`,
    (p: Player) => `EXP: ${p.currentExp}/${p.maxExp}`,
    (p: Player) => `HP:  ${p.health}/${p.stats.HP}`,
    (p: Player) => `STR: ${p.stats.STR}`,
    (p: Player) => `DEF: ${p.stats.DEF}`,
    (p: Player) => `ACC: ${p.stats.ACC}`,
    (p: Player) => `---`,
    (p: Player) => `---`,
]

class Menu {
    readonly borderSize: number
    readonly headerSpacing: number
    readonly optionSpacing: number
    readonly statSpacing: number

    readonly menuHeight: number
    readonly menuWidth: number
    readonly menuPosition: Vector2

    readonly statsHeight: number
    readonly statsWidth: number
    readonly statsPosition: Vector2

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
            // {
            //     title: '---',
            //     getValue: () => '---',
            //     next: () => {},
            //     prev: () => {},
            //     select: () => {}
            // },
        ]

        this.borderSize = 14
        this.optionSpacing = 100
        this.headerSpacing = 70

        this.menuHeight = (this.borderSize * 2) + this.headerSpacing + (this.options.length * this.optionSpacing)
        this.menuWidth = 300 + (this.borderSize * 2)
        this.menuPosition = new Vector2(GRID_SIZE, GRID_SIZE)

        // TODO: Remove the + 10 when the bottom ui is 3 * GRID_SIZE height
        this.miniMapHeight = CNV.height - GRID_SIZE * 5 + 10
        this.miniMapWidth = CNV.width - (GRID_SIZE * 3 + this.menuWidth)
        this.miniMapPosition = new Vector2(GRID_SIZE * 2 + this.menuWidth, GRID_SIZE)

        this.statSpacing = (this.miniMapHeight - ((this.borderSize * 2) + this.headerSpacing + this.menuHeight + GRID_SIZE)) / statMap.length
        this.statsHeight = (this.borderSize * 2) + this.headerSpacing + (this.statSpacing * statMap.length)
        this.statsWidth = 300 + (this.borderSize * 2)
        this.statsPosition = new Vector2(GRID_SIZE, GRID_SIZE * 2 + this.menuHeight)
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

    draw = (map: Map, player: Player) => {
        this.drawMenu()
        this.drawPlayerStats(player)

        // TODO: Check if player has map
        // if (player.inventory.maps.includes(map.title)) this.drawMiniMap(map, player)
        this.drawMiniMap(map, player)
    }

    private drawMenu = () => {
        // Border
        CTX.fillStyle = this.themeManager.getColors().high
        CTX.fillRect(this.menuPosition.x, this.menuPosition.y, this.menuWidth, this.menuHeight)

        // Background
        CTX.fillStyle = this.themeManager.getColors().low
        CTX.fillRect(
            this.menuPosition.x + this.borderSize,
            this.menuPosition.y + this.borderSize,
            this.menuWidth - this.borderSize * 2,
            this.menuHeight - this.borderSize * 2,
        )

        // Draw Header
        CTX.font = `28px Andale Mono`
        CTX.textAlign = 'center'
        CTX.textBaseline = 'middle'
        CTX.fillStyle = this.themeManager.getColors().accent

        CTX.fillText(
            '- Menu -',
            this.menuPosition.x + this.menuWidth / 2,
            this.menuPosition.y + this.borderSize + this.headerSpacing / 2
        )

        // Draw options
        CTX.textAlign = 'left'

        this.options.forEach((option, idx) => {
            // Title
            CTX.fillStyle = this.themeManager.getColors().accent
            CTX.fillText(
                option.title,
                this.menuPosition.x + this.borderSize + 45,
                this.menuPosition.y + this.borderSize + this.headerSpacing + 20 + (idx * this.optionSpacing)
            )
            // Value
            CTX.fillStyle = this.themeManager.getColors().high
            CTX.fillText(
                option.getValue(),
                this.menuPosition.x + this.borderSize + 85,
                this.menuPosition.y + this.borderSize + this.headerSpacing + 60 + (idx * this.optionSpacing)
            )
        })

        // Draw cursor
        CTX.fillRect(
            this.menuPosition.x + this.borderSize + 22,
            this.menuPosition.y + this.borderSize + this.headerSpacing + 11 + (this.cursorIndex * this.optionSpacing),
            12.5,
            12.5
        )
    }

    private drawPlayerStats = (player: Player) => {
        // Border
        CTX.fillStyle = this.themeManager.getColors().high
        CTX.fillRect(this.statsPosition.x, this.statsPosition.y, this.statsWidth, this.statsHeight)

        // Background
        CTX.fillStyle = this.themeManager.getColors().low
        CTX.fillRect(
            this.statsPosition.x + this.borderSize,
            this.statsPosition.y + this.borderSize,
            this.statsWidth - this.borderSize * 2,
            this.statsHeight - this.borderSize * 2,
        )

        // Draw Header
        CTX.font = `28px Andale Mono`
        CTX.textAlign = 'center'
        CTX.textBaseline = 'middle'
        CTX.fillStyle = this.themeManager.getColors().accent
        CTX.fillText(
            '- Stats -',
            this.statsPosition.x + this.statsWidth / 2,
            this.statsPosition.y + this.borderSize + this.headerSpacing / 2
        )

        // Draw stats
        CTX.textAlign = 'left'
        CTX.textBaseline = 'top'
        CTX.fillStyle = this.themeManager.getColors().high
        statMap.forEach((statText, idx) => {
            CTX.fillText(
                statText(player),
                this.statsPosition.x + this.borderSize + 45,
                this.statsPosition.y + this.borderSize + this.headerSpacing + (idx * this.statSpacing)
            )
        })
    }

    private drawMiniMap = (map: Map, player: Player) => {
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

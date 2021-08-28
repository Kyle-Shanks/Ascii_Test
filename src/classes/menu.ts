import { CNV, CTX } from 'src/core/constants'
import { Vector2 } from 'src/core/types'
import { InputEvent, InputKey } from 'src/classes/input'
import ThemeManager, { THEME } from 'src/classes/theme'
import EffectManager, { EFFECT } from './effectManager'

type MenuProps = {
    effectManager: EffectManager
    themeManager: ThemeManager
}

type ActionMap = Record<InputKey, Function>

const themeArr = Object.values(THEME)
const effectArr = Object.values(EFFECT)

class Menu {
    readonly height: number
    readonly width: number
    readonly borderSize: number
    readonly position: Vector2

    private effectManager: EffectManager
    private themeManager: ThemeManager

    private cursorPosition: number
    private _pressActionMap: ActionMap

    constructor(props: MenuProps) {
        this.themeManager = props.themeManager
        this.effectManager = props.effectManager
        this.height = 400
        this.width = 340
        this.borderSize = 10
        this.position = new Vector2(
            (CNV.width - this.width) / 2,
            (CNV.height - this.height) / 2
        )

        this.cursorPosition = 0
        this._pressActionMap = {
            'W': this.cursorUp,
            'A': this.prev,
            'S': this.cursorDown,
            'D': this.next,
            'Shift': () => {},
            'Space': () => {},
            'J': () => {},
            'K': () => {},
        }
    }

    handleInput = (event: InputEvent) => {
        if (event.type === 'press') this._pressActionMap[event.key]()
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

        CTX.font = `28px Andale Mono`
        CTX.textAlign = 'left'
        CTX.textBaseline = 'middle'

        // Theme
        CTX.fillStyle = this.themeManager.getColors().accent
        CTX.fillText('Theme', this.position.x + 55, this.position.y + 50)
        CTX.fillStyle = this.themeManager.getColors().high
        CTX.fillText(this.themeManager.getTheme(), this.position.x + 85, this.position.y + 90)

        // FX
        CTX.fillStyle = this.themeManager.getColors().accent
        CTX.fillText('FX', this.position.x + 55, this.position.y + 150)
        CTX.fillStyle = this.themeManager.getColors().high
        CTX.fillText(this.effectManager.getEffect(), this.position.x + 85, this.position.y + 190)

        // Cursor
        CTX.fillRect(
            this.position.x + 32,
            this.position.y + (this.cursorPosition * 100) + 41,
            12.5,
            12.5
        )
    }

    private cursorUp = () => {
        if (this.cursorPosition > 0) this.cursorPosition--
    }
    private cursorDown = () => {
        if (this.cursorPosition < 1) this.cursorPosition++
    }

    private next = () => {
        switch (this.cursorPosition) {
            case 0: return this.nextTheme()
            case 1: return this.nextEffect()
            case 2: break
            case 3: break
        }
    }
    private prev = () => {
        switch (this.cursorPosition) {
            case 0: return this.prevTheme()
            case 1: return this.prevEffect()
            case 2: break
            case 3: break
        }
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

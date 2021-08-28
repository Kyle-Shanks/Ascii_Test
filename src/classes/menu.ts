import { CNV, CTX } from 'src/core/constants'
import { Vector2 } from 'src/core/types'
import { InputEvent } from 'src/classes/input'
import ThemeManager, { THEME } from 'src/classes/theme'
import EffectManager, { EFFECT } from './effectManager'

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
    readonly position: Vector2

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

        this.borderSize = 10
        this.optionSpacing = 100
        this.height = 20 + (this.borderSize * 2) + (this.options.length * this.optionSpacing)
        this.width = 300 + (this.borderSize * 2)
        this.position = new Vector2(
            (CNV.width - this.width) / 2,
            (CNV.height - this.height) / 2
        )
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

        CTX.font = `28px Andale Mono`
        CTX.textAlign = 'left'
        CTX.textBaseline = 'middle'

        // Draw options
        this.options.forEach((option, idx) => {
            // Title
            CTX.fillStyle = this.themeManager.getColors().accent
            CTX.fillText(
                option.title,
                this.position.x + this.borderSize + 45,
                this.position.y + this.borderSize + 40 + (idx * this.optionSpacing)
            )
            // Value
            CTX.fillStyle = this.themeManager.getColors().high
            CTX.fillText(
                option.getValue(),
                this.position.x + this.borderSize + 85,
                this.position.y + this.borderSize + 80 + (idx * this.optionSpacing)
            )
        })

        // Draw cursor
        CTX.fillRect(
            this.position.x + this.borderSize + 22,
            this.position.y + this.borderSize + 31 + (this.cursorIndex * this.optionSpacing),
            12.5,
            12.5
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

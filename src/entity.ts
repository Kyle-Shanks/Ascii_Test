import { CTX, CHARS, EntityChar, GRID_PAD, GRID_SIZE } from './constants'
import { THEME_MANAGER } from './globals'
import { THEME_COLOR, ThemeColor } from './theme'
import { Vector2 } from './types'

export type EntityProps = {
    position: Vector2
    char?: EntityChar
    color?: ThemeColor
}

// - Entity Class -
class Entity {
    position: Vector2
    char: EntityChar = CHARS.HASH
    size: number = GRID_SIZE
    color: ThemeColor = THEME_COLOR.HIGH

    constructor(props: EntityProps) {
        this.position = props.position
        this.char = props.char ?? this.char
        this.color = props.color ?? this.color
    }

    draw = () => {
        if (this.position.isOutsideGrid()) return
        const drawPos = this.position.multiply(GRID_SIZE)
        CTX.fillStyle = THEME_MANAGER.getColors()[this.color]
        CTX.font = `${this.size}px Andale Mono`
        CTX.textAlign = 'center'
        CTX.textBaseline = 'middle'
        CTX.fillText(this.char, drawPos.x + GRID_PAD, drawPos.y + GRID_PAD)
    }

    isCollided = (entity: Entity): boolean => (
        this.position.x === entity.position.x && this.position.y === entity.position.y
    )
}

export default Entity

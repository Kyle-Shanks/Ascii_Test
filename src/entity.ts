import { CTX, THEME_MANAGER } from './globals'
import { EntityChar, GRID_SIZE, Position } from './constants'
import { THEME_COLOR, ThemeColor } from './theme'

export type EntityProps = {
    position: Position
    char: EntityChar
    color?: ThemeColor
}

// - Entity Class -
class Entity {
    position: Position
    char: EntityChar
    size: number = GRID_SIZE
    color: ThemeColor = THEME_COLOR.HIGH

    constructor(props: EntityProps) {
        this.position = props.position
        this.char = props.char
        this.color = props.color ?? this.color
    }

    draw() {
        CTX.fillStyle = THEME_MANAGER.getColors()[this.color]
        CTX.font = `${this.size}px courier new`
        CTX.textAlign = 'center'
        CTX.textBaseline = 'middle'
        // CTX.fillText(this.msg, this.position.x - camera.position.x, this.position.y - camera.position.y)
        CTX.fillText(this.char, this.position.x, this.position.y)
    }
}

export default Entity

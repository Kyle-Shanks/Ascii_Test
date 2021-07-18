import { THEME_COLOR, ThemeColor } from 'src/classes/theme'
import { CTX, ENTITY_TYPES, EntityType, GRID_PAD, GRID_SIZE, TYPE_CHAR_MAP } from 'src/core/constants'
import { Vector2 } from 'src/core/types'
import { THEME_MANAGER } from 'src/globals'

export type EntityProps = {
    color?: ThemeColor
    position: Vector2
    size?: number
    type?: EntityType
}

// - Entity Class -
class Entity {
    color: ThemeColor = THEME_COLOR.HIGH
    position: Vector2
    size: number = GRID_SIZE
    type: EntityType = ENTITY_TYPES.DEFAULT

    constructor(props: EntityProps) {
        this.color = props.color ?? this.color
        this.position = props.position
        this.size = props.size ?? this.size
        this.type = props.type ?? this.type
    }

    draw = () => {
        if (this.position.isOutsideGrid()) return
        const drawPos = this.position.multiply(GRID_SIZE)
        CTX.fillStyle = THEME_MANAGER.getColors()[this.color]
        CTX.font = `${this.size}px Andale Mono`
        CTX.textAlign = 'center'
        CTX.textBaseline = 'middle'
        CTX.fillText(TYPE_CHAR_MAP[this.type], drawPos.x + GRID_PAD, drawPos.y + GRID_PAD)
    }

    isCollided = (entity: Entity): boolean => (
        this.position.x === entity.position.x && this.position.y === entity.position.y
    )
}

export default Entity

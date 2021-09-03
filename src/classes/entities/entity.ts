import { THEME_COLOR, ThemeColor } from 'src/classes/theme'
import {
    CNV,
    CTX,
    CHARS,
    EntityChar,
    ENTITY_TYPES,
    EntityType,
    GRID_PAD,
    GRID_SIZE,
} from 'src/core/constants'
import { Vector2 } from 'src/core/types'
import { CAMERA, THEME_MANAGER } from 'src/globals'

type EntitySettings = {
    char: EntityChar,
    color: ThemeColor,
    opaque: boolean,
    solid: boolean,
}

export const TYPE_SETTINGS_MAP: Record<EntityType, EntitySettings> = {
    [ENTITY_TYPES.DEFAULT]: {
        char: CHARS.QUESTION,
        color: THEME_COLOR.HIGH,
        opaque: false,
        solid: false,
    },
    [ENTITY_TYPES.ACTOR]: {
        char: CHARS.DOLLAR,
        color: THEME_COLOR.ACCENT,
        opaque: false,
        solid: true,
    },
    [ENTITY_TYPES.PLAYER]: {
        char: CHARS.AT,
        color: THEME_COLOR.POP,
        opaque: false,
        solid: true,
    },
    [ENTITY_TYPES.ENEMY]: {
        char: CHARS.EXCLAM,
        color: THEME_COLOR.DANGER,
        opaque: false,
        solid: true,
    },
    [ENTITY_TYPES.WALL]: {
        char: CHARS.HASH,
        color: THEME_COLOR.HIGH,
        opaque: true,
        solid: true,
    },
    [ENTITY_TYPES.DOT]: {
        char: CHARS.DOT,
        color: THEME_COLOR.HIGH,
        opaque: false,
        solid: false,
    },
    [ENTITY_TYPES.GATE]: {
        char: CHARS.DASH,
        color: THEME_COLOR.ACCENT,
        opaque: true,
        solid: true,
    },
    [ENTITY_TYPES.DOOR]: {
        char: CHARS.PLUS,
        color: THEME_COLOR.ACCENT,
        opaque: true,
        solid: true,
    },
    [ENTITY_TYPES.KEY]: {
        char: CHARS.EQUAL,
        color: THEME_COLOR.ACCENT,
        opaque: false,
        solid: false,
    },
    [ENTITY_TYPES.GOLD]: {
        char: CHARS.DOLLAR,
        color: THEME_COLOR.ACCENT,
        opaque: false,
        solid: false,
    },
    [ENTITY_TYPES.PORTAL]: {
        char: CHARS.GT,
        color: THEME_COLOR.ACCENT,
        opaque: false,
        solid: false,
    },
    [ENTITY_TYPES.POTION]: {
        char: CHARS.AMP,
        color: THEME_COLOR.ACCENT,
        opaque: false,
        solid: false,
    },
} as const

export type EntityProps = {
    position: Vector2
    type?: EntityType
    char?: EntityChar
}

// - Entity Class -
class Entity {
    position: Vector2
    type: EntityType = ENTITY_TYPES.DEFAULT
    private _char: EntityChar | null // Allow for character override

    constructor(props: EntityProps) {
        this.position = props.position
        this.type = props.type ?? this.type
        this._char = props.char || null
    }

    draw = (color?: ThemeColor) => {
        if (this.isOutsideGrid()) return
        const drawPos = this.position.multiply(GRID_SIZE).subtract(CAMERA.absPosition)

        if (this.type === ENTITY_TYPES.PLAYER || this.type === ENTITY_TYPES.ENEMY) {
            CTX.fillStyle = THEME_MANAGER.getColors()['background']
            CTX.fillRect(drawPos.x + GRID_SIZE / 2, drawPos.y + GRID_SIZE / 2, GRID_SIZE, GRID_SIZE)
        }

        CTX.fillStyle = THEME_MANAGER.getColors()[color || TYPE_SETTINGS_MAP[this.type].color]
        CTX.font = `${GRID_SIZE}px Andale Mono`
        CTX.textAlign = 'center'
        CTX.textBaseline = 'middle'
        CTX.fillText(
            this._char || TYPE_SETTINGS_MAP[this.type].char,
            drawPos.x + GRID_PAD,
            drawPos.y + GRID_PAD
        )
    }

    setPosition = (pos: Vector2) => {
        this.position = pos
    }

    isSolid = (): boolean => TYPE_SETTINGS_MAP[this.type].solid
    isOpaque = (): boolean => TYPE_SETTINGS_MAP[this.type].opaque

    isCollided = (entity: Entity): boolean => (
        this.position.x === entity.position.x && this.position.y === entity.position.y
    )

    isOutsideGrid = (): boolean => {
        const viewedPosition = this.position.subtract(CAMERA.position)
        return (
            viewedPosition.x < 0
            || viewedPosition.y < 0
            || viewedPosition.x > ((CNV.width - GRID_PAD * 2) / GRID_SIZE)
            || viewedPosition.y > ((CNV.height - GRID_PAD * 2) / GRID_SIZE)
        )
    }
}

export default Entity

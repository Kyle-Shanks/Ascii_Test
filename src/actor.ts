import { CHARS, EntityChar, GRID_SIZE } from './constants'
import Entity, { EntityProps } from './entity'
import { ThemeColor, THEME_COLOR } from './theme'
import { Vector2 } from './types'

export interface ActorProps extends EntityProps {
    // Any actor specific props go here
}

class Actor extends Entity {
    position: Vector2
    char: EntityChar = CHARS.QUESTION
    size: number = GRID_SIZE
    color: ThemeColor = THEME_COLOR.POP
    updatePosition!: {(): void}

    constructor(props: ActorProps) {
        super(props)
        this.position = props.position
    }
}

export default Actor

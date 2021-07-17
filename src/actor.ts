import { CHARS, EntityChar, GRID_SIZE, Position } from "./constants";
import Entity, { EntityProps } from "./entity";
import { ThemeColor, THEME_COLOR } from "./theme";

export interface ActorProps extends EntityProps {
    // Any actor specific props go here
}

class Actor extends Entity {
    position: Position
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

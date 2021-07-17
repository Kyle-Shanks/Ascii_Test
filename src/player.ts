import Actor, { ActorProps } from "./actor";
import { CHARS, EntityChar, GRID_SIZE, Position } from "./constants";
import { InputEvent, InputState } from "./input";
import { ThemeColor, THEME_COLOR } from "./theme";

interface PlayerProps extends ActorProps {
    // Any player specific props go here
}

class Player extends Actor {
    position: Position
    char: EntityChar = CHARS.AT
    size: number = GRID_SIZE
    color: ThemeColor = THEME_COLOR.POP

    constructor(props: PlayerProps) {
        super(props)
        this.position = props.position
    }

    handleInput = (event: InputEvent) => {
        // Handle input things
        if (event.type === 'press') {
            switch (event.key) {
                case 'W': this.position.y -= GRID_SIZE; break;
                case 'A': this.position.x -= GRID_SIZE; break;
                case 'S': this.position.y += GRID_SIZE; break;
                case 'D': this.position.x += GRID_SIZE; break;
            }
        }
    }

    updatePosition = () => {
        // Do the things
    }
}

export default Player

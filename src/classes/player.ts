import Actor, { ActorProps } from 'src/classes/actor'
import { InputEvent } from 'src/classes/input'
import { ThemeColor, THEME_COLOR } from 'src/classes/theme'
import { CHARS, EntityChar, GRID_SIZE } from 'src/core/constants'
import { Vector2 } from 'src/core/types'

interface PlayerProps extends ActorProps {
    // Any player specific props go here
}

class Player extends Actor {
    position: Vector2
    char: EntityChar = CHARS.AT
    size: number = GRID_SIZE
    color: ThemeColor = THEME_COLOR.POP

    constructor(props: PlayerProps) {
        super(props)
        this.position = props.position
    }

    update = (event: InputEvent, wallMap: number[][]) => {
        if (event.type === 'press') {
            let dir: Vector2 | null = null
            switch (event.key) {
                case 'W':
                    dir = Vector2.UP
                    break
                case 'A':
                    dir = Vector2.LEFT
                    break
                case 'S':
                    dir = Vector2.DOWN
                    break
                case 'D':
                    dir = Vector2.RIGHT
                    break
                case 'Shift':
                    this.color = THEME_COLOR.HIGH
                    break
            }

            if (dir) this._updatePosition(dir, wallMap)
        } else if (event.type === 'release') {
            switch (event.key) {
                case 'Shift':
                    this.color = THEME_COLOR.POP
                    break
            }
        }
    }

    private _updatePosition = (vec: Vector2, wallMap: number[][]) => {
        const newPosition = this.position.add(vec)
        // Check if outside grid or if a wall is at the new position
        if (newPosition.isOutsideGrid() || wallMap[newPosition.y]?.[newPosition.x]) return
        this.position = newPosition
    }
}

export default Player

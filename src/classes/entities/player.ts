import Actor, { ActorProps } from 'src/classes/entities/actor'
import { InputEvent } from 'src/classes/input'
import Map from 'src/classes/map'
import { ENTITY_TYPES } from 'src/core/constants'
import { Vector2 } from 'src/core/types'

interface PlayerProps extends ActorProps {
    // Any player specific props go here
}

class Player extends Actor {
    constructor(props: PlayerProps) {
        super(props)
        this.type = ENTITY_TYPES.PLAYER
    }

    update = (event: InputEvent, map: Map) => {
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
            }

            if (dir) this._updatePosition(dir, map)
        } else if (event.type === 'release') {
            switch (event.key) {}
        }
    }

    private _updatePosition = (dir: Vector2, map: Map) => {
        const newPosition = this.position.add(dir)
        const entityAtPosition = map.getAtPosition(newPosition)

        if (entityAtPosition !== null && entityAtPosition.isSolid()) return

        this.position = newPosition
    }
}

export default Player

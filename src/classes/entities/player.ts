import Actor, { ActorProps } from 'src/classes/entities/actor'
import { InputEvent, InputKey } from 'src/classes/input'
import Map from 'src/classes/map'
import { ENTITY_TYPES } from 'src/core/constants'
import { Vector2 } from 'src/core/types'

interface PlayerProps extends ActorProps {
    // Any player specific props go here
}

type ActionMap = Record<InputKey, (map: Map) => void>

class Player extends Actor {
    _pressActionMap: ActionMap
    _releaseActionMap: ActionMap

    constructor(props: PlayerProps) {
        super(props)
        this.type = ENTITY_TYPES.PLAYER

        this._pressActionMap = {
            'W': (map: Map) => this._updatePosition(Vector2.UP, map),
            'A': (map: Map) => this._updatePosition(Vector2.LEFT, map),
            'S': (map: Map) => this._updatePosition(Vector2.DOWN, map),
            'D': (map: Map) => this._updatePosition(Vector2.RIGHT, map),
            'Shift': (map: Map) => {},
            'Space': (map: Map) => {},
            'J': (map: Map) => {},
            'K': (map: Map) => {},
        }
        this._releaseActionMap = {
            'W': (map: Map) => {},
            'A': (map: Map) => {},
            'S': (map: Map) => {},
            'D': (map: Map) => {},
            'Shift': (map: Map) => {},
            'Space': (map: Map) => {},
            'J': (map: Map) => {},
            'K': (map: Map) => {},
        }
    }

    update = (event: InputEvent, map: Map) => {
        if (event.type === 'press') this._pressActionMap[event.key](map)
        else if (event.type === 'release') this._releaseActionMap[event.key](map)
    }

    private _updatePosition = (dir: Vector2, map: Map) => {
        const newPosition = this.position.add(dir)
        const entityAtPosition = map.getAtPosition(newPosition)

        if (entityAtPosition === null || !entityAtPosition.isSolid()) this.position = newPosition
    }
}

export default Player

import Actor, { ActorProps } from 'src/classes/entities/actor'
import { InputEvent, InputKey } from 'src/classes/input'
import LogManager from 'src/classes/logManager'
import Map from 'src/classes/map'
import { ENTITY_TYPES } from 'src/core/constants'
import { Vector2 } from 'src/core/types'

interface PlayerProps extends ActorProps {
    // Any player specific props go here
}

type ActionMap = Record<InputKey, (map: Map) => void>

type Inventory = {
    [ENTITY_TYPES.GOLD]: number
    [ENTITY_TYPES.KEY]: number
}

class Player extends Actor {
    private _pressActionMap: ActionMap
    private _releaseActionMap: ActionMap
    private logManager: LogManager
    inventory: Inventory

    constructor(props: PlayerProps, logManager: LogManager) {
        super(props)
        this.type = ENTITY_TYPES.PLAYER
        this.logManager = logManager

        this.inventory = {
            [ENTITY_TYPES.GOLD]: 0,
            [ENTITY_TYPES.KEY]: 0,
        }

        this._pressActionMap = {
            'W': (map: Map) => this._updatePosition(Vector2.UP, map),
            'A': (map: Map) => this._updatePosition(Vector2.LEFT, map),
            'S': (map: Map) => this._updatePosition(Vector2.DOWN, map),
            'D': (map: Map) => this._updatePosition(Vector2.RIGHT, map),
            'Shift': (map: Map) => { },
            'Space': (map: Map) => { },
            'J': (map: Map) => this._interact(map),
            'K': (map: Map) => { },
        }
        this._releaseActionMap = {
            'W': (map: Map) => { },
            'A': (map: Map) => { },
            'S': (map: Map) => { },
            'D': (map: Map) => { },
            'Shift': (map: Map) => { },
            'Space': (map: Map) => { },
            'J': (map: Map) => { },
            'K': (map: Map) => { },
        }
    }

    handleInput = (event: InputEvent, map: Map) => {
        if (event.type === 'press') this._pressActionMap[event.key](map)
        else if (event.type === 'release') this._releaseActionMap[event.key](map)
    }

    private _updatePosition = (dir: Vector2, map: Map) => {
        const newPosition = this.position.add(dir)
        const entityAtPosition = map.getAtPosition(newPosition)

        if (entityAtPosition === null || !entityAtPosition.isSolid()) {
            this.position = newPosition

            // Check if player walked over an object
            if (entityAtPosition !== null) {
                switch (entityAtPosition.type) {
                    case ENTITY_TYPES.KEY:
                        this.inventory[ENTITY_TYPES.KEY]++
                        map.removeObject(entityAtPosition)
                        this.logManager.addLog({ msg: 'You picked up a key!' })
                        break
                    case ENTITY_TYPES.GOLD:
                        this.inventory[ENTITY_TYPES.GOLD]++
                        map.removeObject(entityAtPosition)
                        break
                }
            }
        }
    }

    private _interact = (map: Map) => {
        const dirs = [Vector2.ZERO, Vector2.UP, Vector2.DOWN, Vector2.LEFT, Vector2.RIGHT] // May not need Vector2.ZERO here?
        const entities = dirs.map((dir) => map.getAtPosition(this.position.add(dir)))

        entities.forEach((entity) => {
            if (entity !== null) {
                switch (entity.type) {
                    case ENTITY_TYPES.DOOR:
                        if (this.inventory[ENTITY_TYPES.KEY] > 0) {
                            this.inventory[ENTITY_TYPES.KEY]--
                            map.openDoor(entity)
                            this.logManager.addLog({ msg: 'You unlocked the door with a key!' })
                        } else {
                            this.logManager.addLog({ msg: 'The door is locked.' })
                        }
                        break
                    case ENTITY_TYPES.WALL:
                        this.logManager.addLog({ msg: 'What a nice wall.' })
                        break
                }
            }
        })
    }
}

export default Player

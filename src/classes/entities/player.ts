import Actor, { ActorProps } from 'src/classes/entities/actor'
import Enemy from 'src/classes/entities/enemy'
import Entity from 'src/classes/entities/entity'
import { InputEvent, InputKey } from 'src/classes/input'
import EventManager, { GAME_EVENT_TYPE } from 'src/classes/eventManager'
import LogManager from 'src/classes/logManager'
import Map from 'src/classes/map'
import { ENTITY_TYPES } from 'src/core/constants'
import { Vector2 } from 'src/core/types'

interface PlayerProps extends ActorProps {
    // Any player specific props go here
}

type ActionMap = Record<InputKey, (map: Map, enemies: Enemy[]) => void>

type Inventory = {
    [ENTITY_TYPES.GOLD]: number
    [ENTITY_TYPES.KEY]: number
}

class Player extends Actor {
    private _pressActionMap: ActionMap
    private _releaseActionMap: ActionMap
    inventory: Inventory

    constructor(props: PlayerProps, logManager: LogManager, eventManager: EventManager) {
        super(props, logManager, eventManager)
        this.type = ENTITY_TYPES.PLAYER

        this.inventory = {
            [ENTITY_TYPES.GOLD]: 0,
            [ENTITY_TYPES.KEY]: 0,
        }

        this._pressActionMap = {
            'W': (map: Map, enemies: Enemy[]) => this._walk(Vector2.UP, map, enemies),
            'A': (map: Map, enemies: Enemy[]) => this._walk(Vector2.LEFT, map, enemies),
            'S': (map: Map, enemies: Enemy[]) => this._walk(Vector2.DOWN, map, enemies),
            'D': (map: Map, enemies: Enemy[]) => this._walk(Vector2.RIGHT, map, enemies),
            'Shift': () => {},
            'Space': () => {},
            'J': (map: Map, enemies: Enemy[]) => this._interact(map, enemies),
            'K': () => {},
        }
        this._releaseActionMap = {
            'W': () => {},
            'A': () => {},
            'S': () => {},
            'D': () => {},
            'Shift': () => {},
            'Space': () => {},
            'J': () => {},
            'K': () => {},
        }
    }

    handleInput = (event: InputEvent, map: Map, enemies: Enemy[]) => {
        if (event.type === 'press') this._pressActionMap[event.key](map, enemies)
        else if (event.type === 'release') this._releaseActionMap[event.key](map, enemies)
    }

    private _walk = (dir: Vector2, map: Map, enemies: Enemy[]) => {
        const newPosition = this.position.add(dir)

        // Check for enemy at the new position
        const enemyAtPosition = enemies.find((enemy) => enemy.position.isEqual(newPosition))
        if (enemyAtPosition?.isSolid()) return this._walkInto(enemyAtPosition)

        // Check for a solid entity at the new position
        const entityAtPosition = map.getAtPosition(newPosition)
        if (entityAtPosition?.isSolid()) return this._walkInto(entityAtPosition)

        // Update position if nothing solid is in the way
        this.position = newPosition
        this.eventManager.dispatch(GAME_EVENT_TYPE.PLAYER_MOVE)

        // If player walked over something, check it out
        if (entityAtPosition) {
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

    private _walkInto = (entity: Entity) => {
        if (entity instanceof Enemy) {
            this.attack(entity)
            this.eventManager.dispatch(GAME_EVENT_TYPE.PLAYER_MOVE)
        } else {
            // Do things based on type here
            switch (entity.type) {}
        }
    }

    private _interact = (map: Map, enemies: Enemy[]) => {
        const dirs = [Vector2.ZERO, Vector2.UP, Vector2.DOWN, Vector2.LEFT, Vector2.RIGHT] // May not need Vector2.ZERO here?
        const entities = dirs.map((dir) => map.getAtPosition(this.position.add(dir)))
        let interaction = false

        entities.forEach((entity) => {
            if (entity !== null) {
                switch (entity.type) {
                    case ENTITY_TYPES.WALL:
                        this.logManager.addLog({ msg: 'What a nice wall.' })
                        break
                    case ENTITY_TYPES.GATE:
                        map.openDoor(entity)
                        interaction = true
                        break
                    case ENTITY_TYPES.DOOR:
                        if (this.inventory[ENTITY_TYPES.KEY] > 0) {
                            this.inventory[ENTITY_TYPES.KEY]--
                            map.openDoor(entity)
                            this.logManager.addLog({ msg: 'You unlocked the door with a key!' })
                            interaction = true
                        } else {
                            this.logManager.addLog({ msg: 'The door is locked.' })
                        }
                        break
                }
            }
        })

        if (interaction) this.eventManager.dispatch(GAME_EVENT_TYPE.PLAYER_ACTION)
    }
}

export default Player

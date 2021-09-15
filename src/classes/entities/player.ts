import Actor, { ActorProps } from 'src/classes/entities/actor'
import Enemy from 'src/classes/entities/enemy'
import Entity from 'src/classes/entities/entity'
import { Button, InputEvent, InputType } from 'src/classes/input'
import EventManager, { GAME_EVENT_TYPE } from 'src/classes/eventManager'
import LogManager from 'src/classes/logManager'
import Map from 'src/classes/map'
import { THEME_COLOR } from 'src/classes/theme'
import { ENTITY_TYPES } from 'src/core/constants'
import { Vector2 } from 'src/core/types'

interface PlayerProps extends ActorProps {
    // Any player specific props go here
}

type Inventory = {
    [ENTITY_TYPES.GOLD]: number
    [ENTITY_TYPES.KEY]: number
}

class Player extends Actor {
    currentExp: number
    maxExp: number
    level: number
    inventory: Inventory

    constructor(props: PlayerProps, logManager: LogManager, eventManager: EventManager) {
        super(props, logManager, eventManager)
        this.type = ENTITY_TYPES.PLAYER

        this.level = 1
        this.currentExp = 0
        this.maxExp = 10

        this.inventory = {
            [ENTITY_TYPES.GOLD]: 0,
            [ENTITY_TYPES.KEY]: 0,
        }
    }

    handleInput = (event: InputEvent, map: Map, enemies: Enemy[]) => {
        if (event.type === InputType.PRESS) {
            switch (event.button) {
                case Button.UP: return this._walk(Vector2.UP, map, enemies)
                case Button.DOWN: return this._walk(Vector2.DOWN, map, enemies)
                case Button.LEFT: return this._walk(Vector2.LEFT, map, enemies)
                case Button.RIGHT: return this._walk(Vector2.RIGHT, map, enemies)
                case Button.A: return this._interact(map, enemies)
            }
        }
    }

    private gainExp = (exp: number) => {
        this.currentExp += exp
        if (this.currentExp >= this.maxExp) this.levelUp()
    }

    private levelUp = () => {
        this.currentExp = Math.max(this.currentExp - this.maxExp, 0)
        this.level++
        // TODO: Add more sophisticated max exp increase per level
        this.maxExp *= 2

        // Increase max health and refill health
        this.stats.HP += (2 * this.level)
        this.health = this.stats.HP

        this.logManager.addLog({ msg: `Leveled Up to level ${this.level}!`, color: THEME_COLOR.ACCENT })
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
                case ENTITY_TYPES.POTION:
                    this.heal(5)
                    map.removeObject(entityAtPosition)
                    this.logManager.addLog({ msg: 'You healed 5 HP from a potion!' })
                    break
            }
        }
    }

    private _walkInto = (entity: Entity) => {
        if (entity instanceof Enemy) {
            this.attack(entity)
            if (entity.health === 0) this.gainExp(entity.exp)
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
                        // this.logManager.addLog({ msg: 'What a nice wall.' })
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

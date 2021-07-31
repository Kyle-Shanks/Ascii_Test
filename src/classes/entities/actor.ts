import Entity, { EntityProps } from 'src/classes/entities/entity'
import LogManager from 'src/classes/logManager'
import { ENTITY_TYPES } from 'src/core/constants'
import { Stats } from 'src/core/types'

export interface ActorProps extends EntityProps {
    stats: Stats
}

class Actor extends Entity {
    health: number
    stats: Stats
    update!: Function
    protected logManager: LogManager

    constructor(props: ActorProps, logManager: LogManager) {
        super(props)
        this.health = props.stats.HP
        this.stats = props.stats
        this.type = ENTITY_TYPES.ACTOR
        this.logManager = logManager
    }

    takeDamage = (dmg: number) => {
        // TODO: Need to implement DEF stat here
        this.health = Math.max(this.health - dmg, 0)
    }

    heal = (amount: number) => {
        this.health = Math.min(this.health + amount, this.stats.HP)
    }

    protected _attack = (actor: Actor) => {
        const rand = Math.random() * 100

        // TODO: Log miss
        if (this.stats.ACC < rand) return

        // TODO: Log Hit
        actor.takeDamage(this.stats.STR)
    }
}

export default Actor

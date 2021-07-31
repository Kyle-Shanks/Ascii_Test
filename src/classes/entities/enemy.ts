import Actor, { ActorProps } from 'src/classes/entities/actor'
import { ENTITY_TYPES } from 'src/core/constants'

interface EnemyProps extends ActorProps {
    // Any Enemy specific props go here
}

class Enemy extends Actor {
    constructor(props: EnemyProps) {
        super(props)
        this.type = ENTITY_TYPES.ENEMY
    }

    private _updatePosition = () => {}
}

export default Enemy

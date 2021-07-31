import Actor, { ActorProps } from 'src/classes/entities/actor'
import LogManager from 'src/classes/logManager'
import { ENTITY_TYPES } from 'src/core/constants'
import { EnemyType } from 'src/core/enemyData'

interface EnemyProps extends ActorProps {
    enemyType: EnemyType
}

class Enemy extends Actor {
    enemyType: EnemyType

    constructor(props: EnemyProps, logManager: LogManager) {
        super(props, logManager)
        this.type = ENTITY_TYPES.ENEMY
        this.enemyType = props.enemyType
    }

    private _updatePosition = () => {}
}

export default Enemy

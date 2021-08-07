import Actor, { ActorProps } from 'src/classes/entities/actor'
import Player from 'src/classes/entities/player'
import LogManager from 'src/classes/logManager'
import Map from 'src/classes/map'
import { ENTITY_TYPES } from 'src/core/constants'
import { EnemyType } from 'src/core/enemyData'

const ENEMY_STATE = {
    IDLE: 'idle',
    CHASE: 'chase',
} as const

type EnemyState = typeof ENEMY_STATE[keyof typeof ENEMY_STATE]

interface EnemyProps extends ActorProps {
    enemyType: EnemyType
    moveSpeed: number
}

class Enemy extends Actor {
    enemyType: EnemyType
    state: EnemyState
    moveSpeed: number
    private moveTimer: number

    constructor(props: EnemyProps, logManager: LogManager) {
        super(props, logManager)
        this.type = ENTITY_TYPES.ENEMY
        this.enemyType = props.enemyType
        this.state = ENEMY_STATE.IDLE

        this.moveSpeed = props.moveSpeed
        this.moveTimer = 0
    }

    update = (map: Map, player: Player, enemies: Enemy[]) => {
        switch (this.state) {
            case ENEMY_STATE.IDLE:
                if (this.canSeePlayer(player, map)) {
                    this.moveTimer = 0
                    this.state = ENEMY_STATE.CHASE
                }
                break
            case ENEMY_STATE.CHASE:
                if (this.moveTimer === 0) {
                    if (this.canAttackPlayer(player)) {
                        this.attack(player)
                    } else if (this.position.distanceTo(player.position) > 8) {
                        this.state = ENEMY_STATE.IDLE
                    } else {
                        this.moveTowardsPlayer(player, map, enemies)
                    }
                }
                this.moveTimer = (this.moveTimer + 1) % this.moveSpeed
                break
        }
    }

    private canAttackPlayer = (player: Player): boolean => this.position.distanceTo(player.position) <= 1

    private canSeePlayer = (player: Player, map: Map): boolean => {
        if (this.position.distanceTo(player.position) > 7) return false

        let canSee = true
        const pathToPlayer = this.position.bresenham(player.position).slice(0, -1)

        pathToPlayer.forEach((pos) => {
            const entity = map.getAtPosition(pos)
            if (entity?.isOpaque()) canSee = false
        })

        return canSee
    }

    private moveTowardsPlayer = (player: Player, map: Map, enemies: Enemy[]) => {
        const pathToPlayer = this.findPath(player.position, map)
        if (pathToPlayer && pathToPlayer.length > 1) {
            const nextPosition = pathToPlayer[1]
            const enemyAtPosition = enemies.some((enemy) => enemy.position.isEqual(nextPosition))
            if (!enemyAtPosition) this.position = nextPosition
        }
    }
}

export default Enemy

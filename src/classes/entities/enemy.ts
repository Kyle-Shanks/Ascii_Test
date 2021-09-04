import Actor, { ActorProps } from 'src/classes/entities/actor'
import Player from 'src/classes/entities/player'
import EventManager, { GAME_EVENT_TYPE } from 'src/classes/eventManager'
import LogManager from 'src/classes/logManager'
import Map from 'src/classes/map'
import { ENTITY_TYPES } from 'src/core/constants'
import { EnemyType } from 'src/core/enemyData'
import { Vector2 } from 'src/core/types'

const ENEMY_STATE = {
    IDLE: 'idle',
    CHASE: 'chase',
} as const

type EnemyState = typeof ENEMY_STATE[keyof typeof ENEMY_STATE]

interface EnemyProps extends ActorProps {
    enemyType: EnemyType
    moveSpeed: number
    exp: number
}

class Enemy extends Actor {
    enemyType: EnemyType
    state: EnemyState
    moveSpeed: number
    exp: number
    private moveTimer: number

    constructor(props: EnemyProps, logManager: LogManager, eventManager: EventManager) {
        super(props, logManager, eventManager)
        this.type = ENTITY_TYPES.ENEMY
        this.enemyType = props.enemyType
        this.state = ENEMY_STATE.IDLE
        this.exp = props.exp

        this.moveSpeed = props.moveSpeed
        this.moveTimer = 0
    }

    update = (map: Map, player: Player, enemies: Enemy[]) => {
        switch (this.state) {
            case ENEMY_STATE.IDLE:
                if (!this.isOutsideGrid() && this.canSeePlayer(player, map)) {
                    this.moveTimer = 0
                    this.state = ENEMY_STATE.CHASE
                }
                break
            case ENEMY_STATE.CHASE:
                if (this.moveTimer === 0) {
                    if (this.canAttackPlayer(player)) {
                        const hit = this.attack(player)
                        if (hit) this.eventManager.dispatch(GAME_EVENT_TYPE.PLAYER_DAMAGED)
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
        if (this.position.distanceTo(player.position) > this.vision) return false

        let canSee = true
        const pathToPlayer = this.position.bresenham(player.position).slice(0, -1)

        pathToPlayer.forEach((pos) => {
            const entity = map.getAtPosition(pos)
            if (entity?.isOpaque()) canSee = false
        })

        return canSee
    }

    private findFreeSpotAroundPlayer = (player: Player, map: Map, enemies: Enemy[]): Vector2 | null => {
        const posArr = player.position.getAdjacent()
        posArr.sort((a, b) => a.distanceTo(this.position) - b.distanceTo(this.position))

        for (let i = 0; i < posArr.length; i++) {
            const pos = posArr[i]
            if (map.isPositionWalkable(pos) && enemies.every((enemy) => !enemy.position.isEqual(pos))) {
                return pos
            }
        }

        return null
    }

    private moveTowardsPlayer = (player: Player, map: Map, enemies: Enemy[]) => {
        // Find a free spot around the player to move towards, or just the player position
        const pos = this.findFreeSpotAroundPlayer(player, map, enemies) ?? player.position
        const pathToPlayer = this.findPath(pos, map)

        if (pathToPlayer && pathToPlayer.length > 1) {
            const nextPos = pathToPlayer[1]
            if (enemies.every((enemy) => !enemy.position.isEqual(nextPos))) this.position = nextPos
        }
    }
}

export default Enemy

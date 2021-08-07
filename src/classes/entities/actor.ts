import Entity, { EntityProps } from 'src/classes/entities/entity'
import LogManager from 'src/classes/logManager'
import Map from 'src/classes/map'
import { ENTITY_TYPES } from 'src/core/constants'
import { Stats, Vector2 } from 'src/core/types'

type PathNode = {
    position: Vector2
    parent?: PathNode
    cost: number
}

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

    protected attack = (actor: Actor) => {
        const rand = Math.random() * 100

        // TODO: Log miss
        if (this.stats.ACC < rand) return

        // TODO: Log Hit
        actor.takeDamage(this.stats.STR)
    }

    protected findPath = (pos: Vector2, map: Map): Vector2[] | null => {
        const queue: PathNode[] = [{ position: this.position, cost: 0 }]
        const openSet: Record<string, true> = { [this.position.toString()]: true }
        const closedSet: Record<string, true> = {}

        while (queue.length) {
            const currentNode = queue.shift() as PathNode
            closedSet[currentNode.position.toString()] = true

            // Found the end position, return path
            if (currentNode.position.isEqual(pos)) {
                const path: Vector2[] = [currentNode.position]

                let parent = currentNode.parent
                while (parent) {
                    path.unshift(parent.position)
                    parent = parent.parent
                }

                return path
            }

            // sort positions by distance from target
            const neighbors = currentNode.position.getAdjacent()
            neighbors.sort((a, b) => a.diff(pos) - b.diff(pos))

            // Check neighbors
            neighbors.forEach((pos) => {
                if (
                    currentNode.cost + 1 >= 16
                    || openSet[pos.toString()]
                    || closedSet[pos.toString()]
                    || !map.isPositionWalkable(pos)
                ) {
                    return
                }

                openSet[pos.toString()] = true
                queue.push({
                    position: pos,
                    parent: currentNode,
                    // Based on heuristic_cost_estimate, but always 1 for grid based movement
                    cost: currentNode.cost + 1,
                })
            })
        }

        return null
    }
}

export default Actor

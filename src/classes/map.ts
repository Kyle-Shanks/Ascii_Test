import Entity from 'src/classes/entities/entity'
import { THEME_COLOR } from 'src/classes/theme'
import { ENTITY_TYPES } from 'src/core/constants'
import { MapInfo, MapData, MapNumMap } from 'src/core/mapData'
import { Vector2 } from 'src/core/types'

class Map {
    height: number
    width: number
    title: string
    data: MapData
    entities: Entity[]
    startPosition: Vector2
    seenMap: Record<string, boolean>

    constructor(info: MapInfo) {
        this.title = info.title
        this.data = info.data
        this.height = info.data.length
        this.width = info.data[0].length
        this.entities = this._getEntities()
        this.startPosition = info.startPosition
        this.seenMap = {}
    }

    draw = (lightMap: Record<string, boolean>) => {
        this.entities.forEach((entity) => {
            const key = `${entity.position.x},${entity.position.y}`
            if (lightMap[key]) {
                entity.draw()
                this.seenMap[key] = true
            } else if (this.seenMap[key]) {
                entity.draw(THEME_COLOR.LOW)
            }
        })
    }

    isPositionOutsideMap = (pos: Vector2): boolean => (
        pos.x < 0 || pos.y < 0 || pos.x >= this.width || pos.y >= this.height
    )

    isPositionEmpty = (pos: Vector2): boolean => {
        if (this.isPositionOutsideMap(pos)) {
            console.error('Position is outside the map')
            return false
        }
        return this.data[pos.y][pos.x] === null
    }

    private _getEntities = (): Entity[] => {
        const arr: Entity[] = []
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const num = this.data[i][j]
                if (num !== null) {
                    arr.push(
                        new Entity({
                            position: new Vector2(j, i),
                            type: MapNumMap[num],
                        })
                    )
                } else {
                    arr.push(
                        new Entity({
                            position: new Vector2(j, i),
                            type: ENTITY_TYPES.DOT,
                            // color: THEME_COLOR.LOW
                        })
                    )
                }
            }
        }

        return arr
    }
}

export default Map

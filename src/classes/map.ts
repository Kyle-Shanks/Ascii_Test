import Entity from 'src/classes/entities/entity'
import { MapInfo, MapData, MapNumMap, MapNum } from 'src/core/mapData'
import { Vector2 } from 'src/core/types'

class Map {
    height: number
    width: number
    title: string
    data: MapData
    entities: Entity[]

    constructor(info: MapInfo) {
        this.title = info.title
        this.data = info.data
        this.height = info.data.length
        this.width = info.data[0].length
        this.entities = this._getEntities()
    }

    draw = () => {
        this.entities.forEach((entity) => entity.draw())
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
                const num: MapNum | null = this.data[i][j]
                if (num !== null) {
                    arr.push(
                        new Entity({
                            position: new Vector2(j, i),
                            type: MapNumMap[num]
                        })
                    )
                }
            }
        }

        return arr
    }
}

export default Map

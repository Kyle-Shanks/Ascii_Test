import Entity from 'src/classes/entity'
import { MapInfo } from 'src/core/mapData'
import { Vector2 } from 'src/core/types'

class Map {
    title: string
    data: number[][]
    entities: Entity[]

    constructor(info: MapInfo) {
        this.title = info.title
        this.data = info.data
        this.entities = this._getEntities()
    }

    draw = () => {
        this.entities.forEach((entity) => entity.draw())
    }

    isPositionEmpty = (pos: Vector2): boolean => this.data[pos.y]?.[pos.x] === 0

    private _getEntities = (): Entity[] => {
        const arr: Entity[] = []
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                if (this.data[i][j]) {
                    arr.push(
                        new Entity({ position: new Vector2(j, i) })
                    )
                }
            }
        }

        return arr
    }
}

export default Map

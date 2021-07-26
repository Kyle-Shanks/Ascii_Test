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
    objects: Entity[]
    solids: Entity[]
    opaques: Entity[]
    startPosition: Vector2
    seenMap: Record<string, boolean>

    constructor(info: MapInfo) {
        this.title = info.title
        this.data = info.data
        this.height = info.data.length
        this.width = info.data[0].length
        this.startPosition = info.startPosition
        this.seenMap = {}

        this.entities = []
        this.objects = []
        this.solids = []
        this.opaques = []
        this._getEntities()
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
            return true
        }
        return this.data[pos.y][pos.x] === null
    }

    getAtPosition = (pos: Vector2): Entity | null => {
        if (this.isPositionEmpty(pos)) return null
        return this.objects.find((entity) => entity.position.isEqual(pos)) || null
    }

    private _getEntities = () => {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const num = this.data[i][j]
                const entity = new Entity({
                    position: new Vector2(j, i),
                    type: num === null ? ENTITY_TYPES.DOT : MapNumMap[num]
                })

                this.entities.push(entity)
                if (num !== null) this.objects.push(entity)
                if (entity.isSolid()) this.solids.push(entity)
                if (entity.isOpaque()) this.opaques.push(entity)
            }
        }
    }
}

export default Map

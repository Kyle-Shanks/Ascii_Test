import Entity from 'src/classes/entities/entity'
import { THEME_COLOR } from 'src/classes/theme'
import { ENTITY_TYPES } from 'src/core/constants'
import { MAP_NUM, MapInfo, MapData, MapNumMap, MapSize } from 'src/core/mapData'
import { Vector2 } from 'src/core/types'

class Map {
    readonly height: number
    readonly width: number
    readonly size: MapSize
    readonly title: string
    readonly startPosition: Vector2
    readonly seenMap: Record<string, boolean>
    data: MapData
    entities: Entity[]
    objects: Entity[]
    solids: Entity[]
    opaques: Entity[]

    constructor(info: MapInfo) {
        this.title = info.title
        this.data = info.data
        this.height = info.data.length
        this.width = info.data[0].length
        this.size = info.size
        this.startPosition = info.startPosition
        this.seenMap = {}

        this.entities = []
        this.objects = []
        this.solids = []
        this.opaques = []
        this.getEntities()
    }

    draw = (lightMap: Record<string, boolean>) => {
        this.entities.forEach((entity) => {
            const key = entity.position.toString()
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

    isPositionWalkable = (pos: Vector2): boolean => {
        if (this.isPositionOutsideMap(pos)) return false
        const num = this.data[pos.y][pos.x]
        return num === null || num === MAP_NUM.KEY || num === MAP_NUM.GOLD
    }

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

    removeObject = (obj: Entity) => {
        // Remove object from object arrays
        const objIdx = this.objects.indexOf(obj)
        if (objIdx > -1) this.objects.splice(objIdx, 1)
        const solidIdx = this.solids.indexOf(obj)
        if (solidIdx > -1) this.solids.splice(solidIdx, 1)
        const opaqueIdx = this.opaques.indexOf(obj)
        if (opaqueIdx > -1) this.opaques.splice(opaqueIdx, 1)

        // Set object to a dot
        obj.type = ENTITY_TYPES.DOT

        // Update map data
        this.data[obj.position.y][obj.position.x] = null
    }

    // TODO: Update this to look for more than one extra tile
    openDoor = (door: Entity) => {
        if (door.type !== ENTITY_TYPES.DOOR && door.type !== ENTITY_TYPES.GATE) {
            console.error('Not a door or gate')
            return
        }
        this.removeObject(door)
        // Look for adjacent tiles and remove if they are a door entity
        const posArr = door.position.getAdjacent()
        const objs = posArr.map((pos) => this.getAtPosition(pos))
        objs.forEach((obj) => {
            if (obj?.type === ENTITY_TYPES.DOOR || obj?.type === ENTITY_TYPES.GATE) this.removeObject(obj)
        })
    }

    private getEntities = () => {
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

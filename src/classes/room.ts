import { RoomInfo, RoomType } from 'src/core/roomData'
import { NumMatrix, Vector2 } from 'src/core/types'

class Room {
    readonly id: string
    readonly height: number
    readonly width: number
    readonly type: RoomType
    readonly data: NumMatrix
    readonly position: Vector2
    readonly spawnPoint: Vector2
    readonly keySpawnPoint: Vector2 | null
    readonly enemySpawnPoints: Vector2[]

    constructor(info: RoomInfo, pos: Vector2) {
        // Random id for room
        this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        this.data = info.data
        this.height = info.data.length
        this.width = info.data[0].length
        this.type = info.type

        this.position = pos
        this.spawnPoint = info.spawnPoint.add(pos)
        this.keySpawnPoint = info.keySpawnPoint ? info.keySpawnPoint.add(pos) : null
        this.enemySpawnPoints = info.enemySpawnPoints.map((point) => point.add(pos))
    }

    // AABB style collision detection
    isCollided = (room: Room) => (
        this.position.x < room.position.x + room.width
        && this.position.x + this.width > room.position.x
        && this.position.y < room.position.y + room.height
        && this.position.y + this.height > room.position.y
    )

    // AABB style collision detection
    // Padding of 1 in all directions to account for the room border
    isOverlapping = (room: Room) => (
        this.position.x < room.position.x + room.width - 1
        && this.position.x + this.width > room.position.x + 1
        && this.position.y < room.position.y + room.height - 1
        && this.position.y + this.height > room.position.y + 1
    )
}

export default Room

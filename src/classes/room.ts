import { RoomData, RoomInfo, RoomType } from 'src/core/roomData'
import { Vector2 } from 'src/core/types'

class Room {
    height: number
    width: number
    type: RoomType
    data: RoomData
    position: Vector2
    spawnPoint: Vector2
    enemySpawnPoints: Vector2[]

    constructor(info: RoomInfo, pos: Vector2) {
        this.data = info.data
        this.height = info.data.length
        this.width = info.data[0].length
        this.type = info.type

        this.position = pos
        this.spawnPoint = info.spawnPoint.add(pos)
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

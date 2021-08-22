import Room from 'src/classes/room'
import { ENTITY_TYPES, EntityType } from 'src/core/constants'
import { EnemyType, ENEMY_TYPE } from 'src/core/enemyData'
import roomData, { RoomInfo } from 'src/core/roomData'
import { NumMatrix, Vector2 } from 'src/core/types'

// To make the map data visually easier to read
const _ = null

const MAP_SIZE = {
    XS: 24,
    S: 32,
    M: 48,
    L: 64,
    XL: 92,
    XXL: 128,
} as const

export const MAP_NUM = {
    WALL: 0,
    GATE: 1,
    DOOR: 2,
    KEY: 3,
    PORTAL: 4,
    GOLD: 5
} as const

export type MapNum = typeof MAP_NUM[keyof typeof MAP_NUM]

// Map of map data numbers to entity types
export const MapNumMap: Record<MapNum, EntityType> = {
    [MAP_NUM.WALL]: ENTITY_TYPES.WALL,
    [MAP_NUM.GATE]: ENTITY_TYPES.GATE,
    [MAP_NUM.DOOR]: ENTITY_TYPES.DOOR,
    [MAP_NUM.KEY]: ENTITY_TYPES.KEY,
    [MAP_NUM.GOLD]: ENTITY_TYPES.GOLD,
    [MAP_NUM.PORTAL]: ENTITY_TYPES.PORTAL,
} as const

export type MapData = (MapNum | null)[][]

type EnemyProps = {
    position: Vector2
    enemyType: EnemyType
}

export type MapInfo = {
    data: MapData
    enemies: EnemyProps[]
    startPosition: Vector2
    title: string
}

const insertIntoMatrix = (piece: NumMatrix, matrix: NumMatrix, pos: Vector2 = Vector2.ZERO) => {
    piece.forEach((row, y) => {
        const yPos = y + pos.y
        if (yPos >= matrix.length) return
        row.forEach((num, x) => {
            const xPos = x + pos.x
            if (xPos >= matrix[yPos].length) return
            matrix[yPos][xPos] = num
        })
    })
}

const getRoomToInsert = (
    dir: Vector2,
    anchorRoomInfo: { room: Room, dirs: Vector2[], distance: number },
    rooms: Room[],
    map: MapData,
): Room | null => {
    let count = 0
    let skip = false
    let insertRoomInfo = roomData[Math.floor(Math.random() * roomData.length)]
    let insertRoom = new Room(insertRoomInfo, Vector2.ZERO)

    const getInsertPos = (dir: Vector2, roomInfo: RoomInfo): Vector2 => {
        switch (dir) {
            case Vector2.UP:
            case Vector2.LEFT:
                return anchorRoomInfo.room.position.add(
                    new Vector2(
                        dir.x * roomInfo.data[0].length,
                        dir.y * roomInfo.data.length
                    )
                )
            case Vector2.RIGHT:
            case Vector2.DOWN:
                return anchorRoomInfo.room.position.add(
                    new Vector2(
                        dir.x * anchorRoomInfo.room.width,
                        dir.y * anchorRoomInfo.room.height
                    )
                )
            default:
                console.error('Invalid direction in getInsertPos')
                return Vector2.ZERO
        }
    }

    // Try to place a few different rooms
    let insertPos = getInsertPos(dir, insertRoomInfo)
    insertRoom = new Room(insertRoomInfo, insertPos)

    // Check the bounds of the room and make sure its not colliding with other rooms
    while (
        // rooms.some(r => r.isCollided(insertRoom))
        rooms.some(r => r.isOverlapping(insertRoom))
        || insertRoom.position.x < 0
        || insertRoom.position.y < 0
        || insertRoom.position.x + insertRoom.width >= map[0].length
        || insertRoom.position.y + insertRoom.height >= map.length
    ) {
        if (count >= 5) {
            skip = true
            break
        }
        insertRoomInfo = roomData[Math.floor(Math.random() * roomData.length)]
        insertPos = getInsertPos(dir, insertRoomInfo)
        insertRoom = new Room(insertRoomInfo, insertPos)
        count++
    }

    return !skip ? new Room(insertRoomInfo, insertRoom.position.subtract(dir)) : null
}

export const generateMap = (size: number = MAP_SIZE.S): MapInfo => {
    const map: MapData = Array(size).fill(0).map(_num => Array(size).fill(_))
    const rooms: Room[] = []
    const roomFillArr: { room: Room, dirs: Vector2[], distance: number }[] = []

    // Create starting room
    let startRandPos = new Vector2(Math.floor(Math.random() * size), Math.floor(Math.random() * size))
    let startRoomInfo = roomData[Math.floor(Math.random() * roomData.length)]
    let startingRoom = new Room(startRoomInfo, startRandPos)

    // Make sure the starting room fits in the map
    while (
        startingRoom.position.x + startingRoom.width >= map[0].length
        || startingRoom.position.y + startingRoom.height >= map.length
    ) {
        startRandPos = new Vector2(Math.floor(Math.random() * size), Math.floor(Math.random() * size))
        startingRoom = new Room(startRoomInfo, startRandPos)
    }

    // Add the starting room data to the map
    insertIntoMatrix(startingRoom.data, map, startingRoom.position)
    rooms.push(startingRoom)
    roomFillArr.push({
        room: startingRoom,
        dirs: [Vector2.UP, Vector2.LEFT, Vector2.RIGHT, Vector2.DOWN],
        distance: 0,
    })

    // Keep track of the furthest room from the starting room
    let furthestRoom = startingRoom
    let furthestDistance = 0

    while (roomFillArr.length) {
        // Get random room info to insert new room around
        const anchorRoomInfo = roomFillArr[Math.floor(Math.random() * roomFillArr.length)]
        // Get a random direction around room
        const dir = anchorRoomInfo.dirs.splice(Math.floor(Math.random() * anchorRoomInfo.dirs.length), 1)[0]
        // Get new room to insert
        const newRoom = getRoomToInsert(dir, anchorRoomInfo, rooms, map)

        // Add new room
        if (newRoom) {
            switch (dir) {
                case Vector2.UP: {
                    rooms.push(newRoom)
                    roomFillArr.push({
                        room: newRoom,
                        dirs: [Vector2.UP, Vector2.LEFT, Vector2.RIGHT],
                        distance: anchorRoomInfo.distance + 1,
                    })
                    insertIntoMatrix(newRoom.data, map, newRoom.position)
                    // Poke a hole and add a gate to the new room
                    map[newRoom.position.y + newRoom.height - 1][newRoom.position.x + 2] = MAP_NUM.GATE

                    if (anchorRoomInfo.distance + 1 > furthestDistance) {
                        furthestDistance = anchorRoomInfo.distance + 1
                        furthestRoom = newRoom
                    }
                    break
                }
                case Vector2.LEFT: {
                    rooms.push(newRoom)
                    roomFillArr.push({
                        room: newRoom,
                        dirs: [Vector2.UP, Vector2.LEFT, Vector2.DOWN],
                        distance: anchorRoomInfo.distance + 1,
                    })
                    insertIntoMatrix(newRoom.data, map, newRoom.position)
                    // Poke a hole and add a gate to the new room
                    map[newRoom.position.y + 2][newRoom.position.x + newRoom.width - 1] = MAP_NUM.GATE

                    if (anchorRoomInfo.distance + 1 > furthestDistance) {
                        furthestDistance = anchorRoomInfo.distance + 1
                        furthestRoom = newRoom
                    }
                    break
                }
                case Vector2.RIGHT: {
                    rooms.push(newRoom)
                    roomFillArr.push({
                        room: newRoom,
                        dirs: [Vector2.UP, Vector2.RIGHT, Vector2.DOWN],
                        distance: anchorRoomInfo.distance + 1,
                    })
                    insertIntoMatrix(newRoom.data, map, newRoom.position)
                    // Poke a hole and add a gate to the new room
                    map[newRoom.position.y + 2][newRoom.position.x] = MAP_NUM.GATE

                    if (anchorRoomInfo.distance + 1 > furthestDistance) {
                        furthestDistance = anchorRoomInfo.distance + 1
                        furthestRoom = newRoom
                    }
                    break
                }
                case Vector2.DOWN: {
                    rooms.push(newRoom)
                    roomFillArr.push({
                        room: newRoom,
                        dirs: [Vector2.LEFT, Vector2.RIGHT, Vector2.DOWN],
                        distance: anchorRoomInfo.distance + 1,
                    })
                    insertIntoMatrix(newRoom.data, map, newRoom.position)
                    // Poke a hole and add a gate to the new room
                    map[newRoom.position.y][newRoom.position.x + 2] = MAP_NUM.GATE

                    if (anchorRoomInfo.distance + 1 > furthestDistance) {
                        furthestDistance = anchorRoomInfo.distance + 1
                        furthestRoom = newRoom
                    }
                    break
                }
            }
        }

        // Remove anchorRoomInfo if all directions filled
        if (anchorRoomInfo.dirs.length === 0) roomFillArr.splice(roomFillArr.indexOf(anchorRoomInfo), 1)
    }

    // Add portal
    map[furthestRoom.spawnPoint.y][furthestRoom.spawnPoint.x] = MAP_NUM.PORTAL

    console.log({ map, rooms })
    return {
        title: `${Date.now()}`,
        startPosition: startingRoom.spawnPoint,
        enemies: [],
        data: map,
    }
}

const mapData: MapInfo[] = [
    generateMap(MAP_SIZE.XS),
    generateMap(MAP_SIZE.XS),
    generateMap(MAP_SIZE.S),
    generateMap(MAP_SIZE.S),
    generateMap(MAP_SIZE.M),
    generateMap(MAP_SIZE.M),
    generateMap(MAP_SIZE.L),
    generateMap(MAP_SIZE.L),
    generateMap(MAP_SIZE.XL),
    generateMap(MAP_SIZE.XL),
    generateMap(MAP_SIZE.XXL),
    generateMap(MAP_SIZE.XXL),

    // Test Levels
    {
        title: 'Test Level',
        startPosition: new Vector2(3, 3),
        enemies: [
            {
                position: new Vector2(8,6),
                enemyType: ENEMY_TYPE.KOBOLD
            },
            {
                position: new Vector2(11,6),
                enemyType: ENEMY_TYPE.RAT
            },
            {
                position: new Vector2(11,7),
                enemyType: ENEMY_TYPE.RAT
            },
        ],
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,3,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0,_,_,0,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0,_,_,1,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0,_,_,1,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0,_,_,0,_,_,0,_,_,0,0,2,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,0],
            [0,_,_,_,_,_,_,_,5,_,5,_,5,_,_,_,0,_,4,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ],
    },
    {
        title: 'Test Level 2',
        startPosition: new Vector2(3, 3),
        enemies: [],
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,3,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0,0,0,2,2,0,0,0,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0,5,5,5,5,5,5,0,_,_,_,4,_,0],
            [0,_,_,_,_,_,_,0,5,5,5,5,5,5,0,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ],
    },
    {
        title: 'Bigger Test Level',
        startPosition: new Vector2(2, 10),
        enemies: [],
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,0,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,1,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,1,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0],
            [0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,_,_,_,_,_,0,0,0,0,0,0,_,_,_,_,_,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,_,_,_,_,0,0,0,0,0,0,0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,0,_,4,_,0,_,_,_,_,_,_,1,_,_,_,_,_,_,_,_,_,_,_,_,3,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,0,_,_,_,0,_,_,_,_,_,_,1,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,0,0,0,0,0,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,0,0,0,0,_,_,_,0,_,_,_,_,_,_,0,0,0,0,0,0,0,_,_,_,0,0,0,0,0,0,0,_,_,_,_,_,_,0],
            [0,_,_,_,0,_,_,_,0,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,0,_,_,_,0,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_,_,_,_,_,0],
            [0,0,0,_,_,_,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,_,_,0,_,_],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,1,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,1,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0,_,_],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,_,_],
        ],
    },
    {
        title: 'Open Test Level',
        startPosition: new Vector2(19, 14),
        enemies: [
            {
                position: new Vector2(4, 4),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(8, 4),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(12, 4),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(16, 4),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(20, 4),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(24, 4),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(28, 4),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(32, 4),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(36, 4),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(4, 8),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(8, 8),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(12, 8),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(16, 8),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(20, 8),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(24, 8),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(28, 8),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(32, 8),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(36, 8),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(4, 18),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(8, 18),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(12, 18),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(16, 18),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(20, 18),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(24, 18),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(28, 18),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(32, 18),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(36, 18),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(4, 22),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(8, 22),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(12, 22),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(16, 22),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(20, 22),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(24, 22),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(28, 22),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(32, 22),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
            {
                position: new Vector2(36, 22),
                enemyType: ENEMY_TYPE.ZOMBIE
            },
        ],
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ],
    },
]

export default mapData

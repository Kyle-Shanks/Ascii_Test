import Room from 'src/classes/room'
import { ENTITY_TYPES, EntityType } from 'src/core/constants'
import { EnemyType, ENEMY_TYPE } from 'src/core/enemyData'
import roomData from 'src/core/roomData'
import { NumMatrix, Vector2 } from 'src/core/types'

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

// To make the map data visually easier to read
const _ = null

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

const generateMap = (size: number = 40): [MapData, Vector2] => {
    const map: MapData = Array(size).fill(0).map(_num => Array(size).fill(_))
    const rooms: Room[] = []
    const roomFillArr: { room: Room, dirs: string[] }[] = []
    const dirs = ['UP', 'LEFT', 'RIGHT', 'DOWN']

    let startRandPos = new Vector2(Math.floor(Math.random() * size), Math.floor(Math.random() * size))
    let startRoomInfo = roomData[Math.floor(Math.random() * roomData.length)]
    let startingRoom = new Room(startRoomInfo, startRandPos)

    while (
        startingRoom.position.x + startingRoom.width >= map[0].length
        || startingRoom.position.y + startingRoom.height >= map.length
    ) {
        startRandPos = new Vector2(Math.floor(Math.random() * size), Math.floor(Math.random() * size))
        startingRoom = new Room(startRoomInfo, startRandPos)
    }

    insertIntoMatrix(startingRoom.data, map, startingRoom.position)
    rooms.push(startingRoom)
    roomFillArr.push({ room: startingRoom, dirs: dirs.slice() })

    while (roomFillArr.length) {
        // Get random room
        const roomFillInfo = roomFillArr[Math.floor(Math.random() * roomFillArr.length)]
        // Get a random direction
        const dir = roomFillInfo.dirs.splice(Math.floor(Math.random() * roomFillInfo.dirs.length), 1)[0]

        let count = 0
        let skip = false
        let insertRoomInfo = roomData[Math.floor(Math.random() * roomData.length)]
        let insertRoom = new Room(insertRoomInfo, Vector2.ZERO)

        switch (dir) {
            case dirs[0]: { // UP
                // try to place a few different rooms above the room
                let insertPos = roomFillInfo.room.position.subtract(new Vector2(0, insertRoomInfo.data.length))
                insertRoom = new Room(insertRoomInfo, insertPos)

                while (
                    rooms.some(r => r.isCollided(insertRoom))
                    || insertRoom.position.x < 0
                    || insertRoom.position.y < 0
                    || insertRoom.position.x + insertRoom.width >= map[0].length
                ) {
                    if (count >= 5) {
                        skip = true
                        break
                    }
                    insertRoomInfo = roomData[Math.floor(Math.random() * roomData.length)]
                    insertPos = roomFillInfo.room.position.subtract(new Vector2(0, insertRoomInfo.data.length))
                    insertRoom = new Room(insertRoomInfo, insertPos)
                    count++
                }

                // Add room
                if (!skip) {
                    const correctPosRoom = new Room(insertRoomInfo, insertRoom.position.subtract(Vector2.UP))
                    rooms.push(correctPosRoom)
                    roomFillArr.push({ room: correctPosRoom, dirs: ['UP', 'LEFT', 'RIGHT'] })
                    insertIntoMatrix(correctPosRoom.data, map, correctPosRoom.position)
                    // Poke a hole and add a gate to the right of the room
                    map[correctPosRoom.position.y + correctPosRoom.height - 1][correctPosRoom.position.x + 2] = 1
                }
                break
            }
            case dirs[1]: { // LEFT
                // try to place a few different rooms to the left of the room
                let insertPos = roomFillInfo.room.position.subtract(new Vector2(insertRoomInfo.data[0].length, 0))
                insertRoom = new Room(insertRoomInfo, insertPos)

                while (
                    rooms.some(r => r.isCollided(insertRoom))
                    || insertRoom.position.x < 0
                    || insertRoom.position.y < 0
                    || insertRoom.position.y + insertRoom.height >= map.length
                ) {
                    if (count >= 5) {
                        skip = true
                        break
                    }
                    insertRoomInfo = roomData[Math.floor(Math.random() * roomData.length)]
                    insertPos = roomFillInfo.room.position.subtract(new Vector2(insertRoomInfo.data[0].length, 0))
                    insertRoom = new Room(insertRoomInfo, insertPos)
                    count++
                }

                // Add room
                if (!skip) {
                    const correctPosRoom = new Room(insertRoomInfo, insertRoom.position.subtract(Vector2.LEFT))
                    rooms.push(correctPosRoom)
                    roomFillArr.push({ room: correctPosRoom, dirs: ['UP', 'LEFT', 'DOWN'] })
                    insertIntoMatrix(correctPosRoom.data, map, correctPosRoom.position)
                    // Poke a hole and add a gate to the right of the room
                    map[correctPosRoom.position.y + 2][correctPosRoom.position.x + correctPosRoom.width - 1] = 1
                }
                break
            }
            case dirs[2]: { // RIGHT
                // try to place a few different rooms to the right of the room
                const insertPos = roomFillInfo.room.position.add(new Vector2(roomFillInfo.room.width, 0))
                insertRoom = new Room(insertRoomInfo, insertPos)

                while (
                    rooms.some(r => r.isCollided(insertRoom))
                    || insertRoom.position.x + insertRoom.width >= map[0].length
                    || insertRoom.position.y + insertRoom.height >= map.length
                ) {
                    if (count >= 5) {
                        skip = true
                        break
                    }
                    insertRoomInfo = roomData[Math.floor(Math.random() * roomData.length)]
                    insertRoom = new Room(insertRoomInfo, insertPos)
                    count++
                }

                // Add room
                if (!skip) {
                    const correctPosRoom = new Room(insertRoomInfo, insertRoom.position.subtract(Vector2.RIGHT))
                    rooms.push(correctPosRoom)
                    roomFillArr.push({ room: correctPosRoom, dirs: ['UP', 'RIGHT', 'DOWN'] })
                    insertIntoMatrix(correctPosRoom.data, map, correctPosRoom.position)
                    // Poke a hole and add a gate to the left of the room
                    map[correctPosRoom.position.y + 2][correctPosRoom.position.x] = 1
                }
                break
            }
            case dirs[3]: { // DOWN
                // try to place a few different rooms below the room
                const insertPos = roomFillInfo.room.position.add(new Vector2(0, roomFillInfo.room.height))
                insertRoom = new Room(insertRoomInfo, insertPos)

                while (
                    rooms.some(r => r.isCollided(insertRoom))
                    || insertRoom.position.x + insertRoom.width >= map[0].length
                    || insertRoom.position.y + insertRoom.height >= map.length
                ) {
                    if (count >= 5) {
                        skip = true
                        break
                    }
                    insertRoomInfo = roomData[Math.floor(Math.random() * roomData.length)]
                    insertRoom = new Room(insertRoomInfo, insertPos)
                    count++
                }

                // Add room
                if (!skip) {
                    const correctPosRoom = new Room(insertRoomInfo, insertRoom.position.subtract(Vector2.DOWN))
                    rooms.push(correctPosRoom)
                    roomFillArr.push({ room: correctPosRoom, dirs: ['LEFT', 'RIGHT', 'DOWN'] })
                    insertIntoMatrix(correctPosRoom.data, map, correctPosRoom.position)
                    // Poke a hole and add a gate to the top of the room
                    map[correctPosRoom.position.y][correctPosRoom.position.x + 2] = 1
                }
                break
            }
        }

        // Remove roomFillInfo if all directions filled
        if (roomFillInfo.dirs.length === 0) roomFillArr.splice(roomFillArr.indexOf(roomFillInfo), 1)
    }

    return [map, startingRoom.spawnPoint]
}

const MAP_SIZE = {
    XS: 24,
    S: 32,
    M: 48,
    L: 64,
    XL: 92,
    XXL: 128,
}

const [getMapData, genStartPos] = generateMap(MAP_SIZE.S)

const mapData: MapInfo[] = [
    {
        title: 'Gen Level',
        startPosition: genStartPos,
        enemies: [],
        data: getMapData,
    },
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

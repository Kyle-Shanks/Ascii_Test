import Room from 'src/classes/room'
import { ENTITY_TYPES, EntityType } from 'src/core/constants'
import { EnemyType, ENEMY_TYPE } from 'src/core/enemyData'
import roomData, { RoomInfo, ROOM_TYPE } from 'src/core/roomData'
import { NumMatrix, Vector2 } from 'src/core/types'
import { rand } from 'src/core/util'

// To make the map data visually easier to read
const _ = null

export const MAP_SIZE = {
    XS: 24,
    S: 32,
    M: 48,
    L: 64,
    XL: 92,
    XXL: 128,
} as const

export type MapSize = typeof MAP_SIZE[keyof typeof MAP_SIZE]

export const MAP_NUM = {
    WALL: 0,
    GATE: 1,
    DOOR: 2,
    KEY: 3,
    PORTAL: 4,
    GOLD: 5,
    POTION: 6,
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
    [MAP_NUM.POTION]: ENTITY_TYPES.POTION,
} as const

export type MapData = (MapNum | null)[][]

type EnemyProps = {
    position: Vector2
    enemyType: EnemyType
}

export type MapInfo = {
    data: MapData
    size: MapSize
    enemies: EnemyProps[]
    startPosition: Vector2
    title: string
}

const mapSizeInfo: Record<MapSize, { maxKeys: number, maxLockedRooms: number }> = {
    [MAP_SIZE.XS]: { maxKeys: 0, maxLockedRooms: 0 },
    [MAP_SIZE.S]: { maxKeys: 1, maxLockedRooms: 1 },
    [MAP_SIZE.M]: { maxKeys: 2, maxLockedRooms: 2 },
    [MAP_SIZE.L]: { maxKeys: 2, maxLockedRooms: 3 },
    [MAP_SIZE.XL]: { maxKeys: 3, maxLockedRooms: 3 },
    [MAP_SIZE.XXL]: { maxKeys: 3, maxLockedRooms: 5 },
}

const getRoomDataFromMapSize = (mapSize: MapSize): RoomInfo[] => {
    if (mapSize === MAP_SIZE.XS || mapSize === MAP_SIZE.S) {
        return roomData.filter((data) => (
            data.type !== ROOM_TYPE.MID
            && data.type !== ROOM_TYPE.LARGE
            && data.type !== ROOM_TYPE.JUMBO
        ))
    } else if (mapSize === MAP_SIZE.M) {
        return roomData.filter((data) => (
            data.type !== ROOM_TYPE.LARGE && data.type !== ROOM_TYPE.JUMBO
        ))
    } else if (mapSize === MAP_SIZE.L) {
        return roomData.filter((data) => data.type !== ROOM_TYPE.JUMBO)
    } else {
        return roomData
    }
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
    anchorRoomInfo: { room: Room, dirs: Vector2[] },
    rooms: Room[],
    mapSize: MapSize,
): Room | null => {
    let count = 0
    let skip = false
    let filteredRoomData = getRoomDataFromMapSize(mapSize)
    let insertRoomInfo = filteredRoomData[rand(filteredRoomData.length)]
    let insertRoom = new Room(insertRoomInfo, Vector2.ZERO)

    const getInsertPos = (dir: Vector2, roomInfo: RoomInfo): Vector2 => {
        if (dir.isEqual(Vector2.UP) || dir.isEqual(Vector2.LEFT)) {
            return anchorRoomInfo.room.position.add(
                new Vector2(
                    dir.x * roomInfo.data[0].length,
                    dir.y * roomInfo.data.length
                )
            )
        } else if (dir.isEqual(Vector2.RIGHT) || dir.isEqual(Vector2.DOWN)) {
            return anchorRoomInfo.room.position.add(
                new Vector2(
                    dir.x * anchorRoomInfo.room.width,
                    dir.y * anchorRoomInfo.room.height
                )
            )
        } else {
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
        || insertRoom.position.x + insertRoom.width >= mapSize
        || insertRoom.position.y + insertRoom.height >= mapSize
    ) {
        if (count >= 5) {
            skip = true
            break
        }
        insertRoomInfo = filteredRoomData[rand(filteredRoomData.length)]
        insertPos = getInsertPos(dir, insertRoomInfo)
        insertRoom = new Room(insertRoomInfo, insertPos)
        count++
    }

    return !skip ? new Room(insertRoomInfo, insertRoom.position.subtract(dir)) : null
}

export const generateMap = (size: MapSize = MAP_SIZE.S): MapInfo => {
    const map: MapData = Array(size).fill(0).map(_num => Array(size).fill(_))
    const rooms: Room[] = []
    const roomDistanceMap: Record<string, number> = {}
    const roomTree: Record<string, string[]> = {}
    // Array of room information where more rooms need to be attached
    const roomFillArr: { room: Room, dirs: Vector2[] }[] = []

    // Create starting room
    let startRandPos = new Vector2(rand(size), rand(size))
    let filteredRoomData = getRoomDataFromMapSize(size)
    let startRoomInfo = filteredRoomData[rand(filteredRoomData.length)]
    let startingRoom = new Room(startRoomInfo, startRandPos)

    // Make sure the starting room fits in the map
    while (
        startingRoom.position.x + startingRoom.width >= size
        || startingRoom.position.y + startingRoom.height >= size
    ) {
        startRandPos = new Vector2(rand(size), rand(size))
        startingRoom = new Room(startRoomInfo, startRandPos)
    }

    // Add the starting room data to the map
    insertIntoMatrix(startingRoom.data, map, startingRoom.position)
    rooms.push(startingRoom)
    roomDistanceMap[startingRoom.id] = 0
    roomTree[startingRoom.id] = []
    roomFillArr.push({
        room: startingRoom,
        dirs: [...Vector2.DIRS],
    })

    // Keep track of the furthest room from the starting room
    let furthestRoom = startingRoom
    let furthestDistance = 0

    // Keep track of the locked rooms
    const lockedRoomIds: string[] = []

    while (roomFillArr.length) {
        // Get random room info to insert new room around
        const anchorRoomInfo = roomFillArr[rand(roomFillArr.length)]
        // Get a random direction around room
        const dir = anchorRoomInfo.dirs.splice(rand(anchorRoomInfo.dirs.length), 1)[0]
        // Get new room to insert
        const newRoom = getRoomToInsert(dir, anchorRoomInfo, rooms, size)

        // Add new room
        if (newRoom) {
            const newRoomDistance = roomDistanceMap[anchorRoomInfo.room.id] + 1
            let gateType: MapNum = MAP_NUM.GATE
            rooms.push(newRoom)
            insertIntoMatrix(newRoom.data, map, newRoom.position)
            roomDistanceMap[newRoom.id] = newRoomDistance
            roomTree[newRoom.id] = []
            roomTree[anchorRoomInfo.room.id].push(newRoom.id)

            // Randomly add locked rooms
            if (
                newRoomDistance >= 5
                && newRoom.type === ROOM_TYPE.MINI
                && newRoom.itemSpawnPoint !== null
                && newRoomDistance <= furthestDistance
                && lockedRoomIds.length < mapSizeInfo[size].maxLockedRooms
                && Math.random() > 0.7
            ) {
                gateType = MAP_NUM.DOOR
                lockedRoomIds.push(newRoom.id)
                // TODO: Spawn either potion or item for stats
                map[newRoom.itemSpawnPoint.y][newRoom.itemSpawnPoint.x] = MAP_NUM.POTION
            } else {
                roomFillArr.push({
                    room: newRoom,
                    // Remove opposite direction bc thats the direction of the room we attached to
                    dirs: Vector2.DIRS.filter(d => !dir.isEqual(d.multiply(-1))),
                })
            }

            if (newRoomDistance > furthestDistance) {
                furthestDistance = newRoomDistance
                furthestRoom = newRoom
            }

            // Add the gate for the new room
            if (dir.isEqual(Vector2.UP)) {
                map[newRoom.position.y + newRoom.height - 1][newRoom.position.x + 2] = gateType
            } else if (dir.isEqual(Vector2.LEFT)) {
                map[newRoom.position.y + 2][newRoom.position.x + newRoom.width - 1] = gateType
            } else if (dir.isEqual(Vector2.RIGHT)) {
                map[newRoom.position.y + 2][newRoom.position.x] = gateType
            } else if (dir.isEqual(Vector2.DOWN)) {
                map[newRoom.position.y][newRoom.position.x + 2] = gateType
            }
        }

        // Remove anchorRoomInfo if all directions filled
        if (anchorRoomInfo.dirs.length === 0) roomFillArr.splice(roomFillArr.indexOf(anchorRoomInfo), 1)
    }

    // Get normal rooms (not start, end, or locked rooms)
    const normalRooms = rooms.filter((room) => (
        room.id !== startingRoom.id
        && room.id !== furthestRoom.id
        && !lockedRoomIds.includes(room.id)
    ))

    // TODO: Make this more efficient. This function is doing too many unnecessary checks
    // Need a map of room that are connected already

    // Poke holes between connected normal rooms for easier travel around the map
    for (const room of normalRooms) {
        for (const checkRoom of normalRooms) {
            if (
                room.id === checkRoom.id
                || roomTree[room.id].includes(checkRoom.id)
                || roomTree[checkRoom.id].includes(room.id)
                || !room.isCollided(checkRoom)
                || Math.random() > 0.7
            ) {
                continue
            }

            // Add gate between rooms
            if (room.position.x + room.width - 1 === checkRoom.position.x) {
                // connected on the right
                if (
                    room.position.y >= checkRoom.position.y
                    && room.position.y < checkRoom.position.y + checkRoom.height - 3
                    && map[room.position.y + 2][checkRoom.position.x + 1] !== MAP_NUM.WALL
                ) {
                    map[room.position.y + 2][checkRoom.position.x] = MAP_NUM.GATE
                    roomTree[room.id].push(checkRoom.id)
                    roomTree[checkRoom.id].push(room.id)
                } else if (
                    checkRoom.position.y >= room.position.y
                    && checkRoom.position.y < room.position.y + room.height - 3
                    && map[checkRoom.position.y + 2][checkRoom.position.x + 1] !== MAP_NUM.WALL
                ) {
                    map[checkRoom.position.y + 2][checkRoom.position.x] = MAP_NUM.GATE
                    roomTree[room.id].push(checkRoom.id)
                    roomTree[checkRoom.id].push(room.id)
                }
            } else if (room.position.x === checkRoom.position.x + checkRoom.width - 1) {
                // connected on the left
                if (
                    room.position.y >= checkRoom.position.y
                    && room.position.y < checkRoom.position.y + checkRoom.height - 3
                    && map[room.position.y + 2][room.position.x - 1] !== MAP_NUM.WALL
                ) {
                    map[room.position.y + 2][room.position.x] = MAP_NUM.GATE
                    roomTree[room.id].push(checkRoom.id)
                    roomTree[checkRoom.id].push(room.id)
                } else if (
                    checkRoom.position.y >= room.position.y
                    && checkRoom.position.y < room.position.y + room.height - 3
                    && map[checkRoom.position.y + 2][room.position.x - 1] !== MAP_NUM.WALL
                ) {
                    map[checkRoom.position.y + 2][room.position.x] = MAP_NUM.GATE
                    roomTree[room.id].push(checkRoom.id)
                    roomTree[checkRoom.id].push(room.id)
                }
            } else if (room.position.y + room.height - 1 === checkRoom.position.y) {
                // connected on the bottom
                if (
                    room.position.x >= checkRoom.position.x
                    && room.position.x < checkRoom.position.x + checkRoom.width - 3
                    && map[checkRoom.position.y + 1][room.position.x + 2] !== MAP_NUM.WALL
                ) {
                    map[checkRoom.position.y][room.position.x + 2] = MAP_NUM.GATE
                    roomTree[room.id].push(checkRoom.id)
                    roomTree[checkRoom.id].push(room.id)
                } else if (
                    checkRoom.position.x >= room.position.x
                    && checkRoom.position.x < room.position.x + room.width - 3
                    && map[checkRoom.position.y + 1][checkRoom.position.x + 2] !== MAP_NUM.WALL
                ) {
                    map[checkRoom.position.y][checkRoom.position.x + 2] = MAP_NUM.GATE
                    roomTree[room.id].push(checkRoom.id)
                    roomTree[checkRoom.id].push(room.id)
                }
            } else if (room.position.y === checkRoom.position.y + checkRoom.height - 1) {
                // connected on the top
                if (
                    room.position.x >= checkRoom.position.x
                    && room.position.x < checkRoom.position.x + checkRoom.width - 3
                    && map[room.position.y - 1][room.position.x + 2] !== MAP_NUM.WALL
                ) {
                    map[room.position.y][room.position.x + 2] = MAP_NUM.GATE
                    roomTree[room.id].push(checkRoom.id)
                    roomTree[checkRoom.id].push(room.id)
                } else if (
                    checkRoom.position.x >= room.position.x
                    && checkRoom.position.x < room.position.x + room.width - 3
                    && map[room.position.y - 1][checkRoom.position.x + 2] !== MAP_NUM.WALL
                ) {
                    map[room.position.y][checkRoom.position.x + 2] = MAP_NUM.GATE
                    roomTree[room.id].push(checkRoom.id)
                    roomTree[checkRoom.id].push(room.id)
                }
            }
        }
    }

    // Add gold to lone rooms (rooms with only one entrance)
    // TODO: Update to spawn either gold (80% chance), a key (10% chance), or a potion (10% chance)
    const loneRooms = normalRooms.filter((room) => roomTree[room.id].length === 0)
    loneRooms.forEach((room) => {
        room.goldSpawnPoints.forEach((point) => {
            if (map[point.y][point.x] === null) map[point.y][point.x] = MAP_NUM.GOLD
        })
    })

    // Get potential enemy rooms
    const enemyRooms = normalRooms.filter((room) => (
        room.enemySpawnPoints.length > 0 && roomDistanceMap[room.id] >= 2
    ))

    // Keep track of number of keys placed
    let keyCount = 0

    // Populate enemies
    let enemies: EnemyProps[] = []
    enemyRooms.forEach((room) => {
        if (Math.random() > 0.7) return

        // TODO: Randomize enemy type based on map size and room depth and number of enemy spawn point in room
        const roomEnemies = room.enemySpawnPoints.map((point) => (
            {
                position: point,
                enemyType: ENEMY_TYPE.RAT,
            }
        ))

        // Randomly put key in enemy room (50% chance)
        if (
            room.itemSpawnPoint !== null
            && keyCount < mapSizeInfo[size].maxKeys
            && Math.random() > 0.5
        ) {
            map[room.itemSpawnPoint.y][room.itemSpawnPoint.x] = MAP_NUM.KEY
            keyCount++
        }

        enemies = [
            ...enemies,
            ...roomEnemies
        ]
    })

    // Add portal in furthest room
    map[furthestRoom.spawnPoint.y][furthestRoom.spawnPoint.x] = MAP_NUM.PORTAL

    // console.log({
    //     keyCount,
    //     rooms: rooms.length,
    //     lockedRooms: lockedRoomIds.length,
    //     loneRooms: loneRooms.length,
    // })

    return {
        size,
        enemies,
        title: `${Date.now()}`,
        startPosition: startingRoom.spawnPoint,
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
        size: MAP_SIZE.XS,
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
        size: MAP_SIZE.XS,
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
        size: MAP_SIZE.M,
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
        size: MAP_SIZE.L,
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

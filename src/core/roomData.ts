import { Vector2 } from 'src/core/types'

export const ROOM_TYPE = {
    MINI: 'mini',
    SMALL: 'small',
    MID: 'mid',
    LARGE: 'large',
    JUMBO: 'jumbo',
} as const

export type RoomType = typeof ROOM_TYPE[keyof typeof ROOM_TYPE]

export type RoomData = (number | null)[][]

export type RoomInfo = {
    type: RoomType
    spawnPoint: Vector2
    enemySpawnPoints: Vector2[]
    data: RoomData
}

// To make the map data visually easier to read
const _ = null

// Ideas
// - Openings for rooms should be procedurally added based on room size and adjacent rooms

// const roomData: Record<RoomType, RoomInfo[]> = {
const roomData: RoomInfo[] = [
    // Mini rooms - 6 and lower
    {
        type: ROOM_TYPE.MINI,
        spawnPoint: new Vector2(2,2),
        enemySpawnPoints: [
            new Vector2(2,2),
        ],
        data: [
            [0,0,0,0,0],
            [0,_,_,_,0],
            [0,_,_,_,0],
            [0,_,_,_,0],
            [0,0,0,0,0],
        ]
    },
    {
        type: ROOM_TYPE.MINI,
        spawnPoint: new Vector2(2,1),
        enemySpawnPoints: [],
        data: [
            [0,0,0,0,0],
            [0,_,_,_,0],
            [0,_,0,_,0],
            [0,_,_,_,0],
            [0,0,0,0,0],
        ]
    },
    {
        type: ROOM_TYPE.MINI,
        spawnPoint: new Vector2(2,2),
        enemySpawnPoints: [
            new Vector2(3, 2),
            new Vector2(6, 2),
        ],
        data: [
            [0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0],
        ]
    },
    {
        type: ROOM_TYPE.MINI,
        spawnPoint: new Vector2(2,2),
        enemySpawnPoints: [
            new Vector2(2,3),
            new Vector2(2,6),
        ],
        data: [
            [0,0,0,0,0],
            [0,_,_,_,0],
            [0,_,_,_,0],
            [0,_,_,_,0],
            [0,_,_,_,0],
            [0,_,_,_,0],
            [0,_,_,_,0],
            [0,_,_,_,0],
            [0,_,_,_,0],
            [0,0,0,0,0],
        ]
    },
    // Small rooms - 10 and lower
    // TODO: Add wide and tall small rooms
    {
        type: ROOM_TYPE.SMALL,
        spawnPoint: new Vector2(2,2),
        enemySpawnPoints: [
            new Vector2(2,2),
            new Vector2(5,2),
            new Vector2(2,5),
            new Vector2(5,5),
        ],
        data: [
            [0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0],
        ]
    },
    {
        type: ROOM_TYPE.SMALL,
        spawnPoint: new Vector2(2,2),
        enemySpawnPoints: [
            new Vector2(2, 2),
            new Vector2(5, 2),
            new Vector2(2, 5),
            new Vector2(5, 5),
        ],
        data: [
            [0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0],
            [0,_,_,0,0,_,_,0],
            [0,_,_,0,0,_,_,0],
            [0,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0],
        ]
    },
    {
        type: ROOM_TYPE.SMALL,
        spawnPoint: new Vector2(2,2),
        enemySpawnPoints: [
            new Vector2(2, 2),
            new Vector2(7, 2),
            new Vector2(2, 7),
            new Vector2(7, 7),
        ],
        data: [
            [0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,0],
            [0,_,_,0,0,0,0,_,_,0],
            [0,_,_,0,_,_,0,_,_,0],
            [0,_,_,0,_,_,0,_,_,0],
            [0,_,_,0,0,0,0,_,_,0],
            [0,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0],
        ]
    },
    // Mid rooms - 15 and lower
    // TODO: Add tall and more wide mid rooms
    {
        type: ROOM_TYPE.MID,
        spawnPoint: new Vector2(3,3),
        enemySpawnPoints: [],
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
        ]
    },
    {
        type: ROOM_TYPE.MID,
        spawnPoint: new Vector2(5,5),
        enemySpawnPoints: [
            new Vector2(2,2),
            new Vector2(9,2),
            new Vector2(2,9),
            new Vector2(9,9),
            new Vector2(4,4),
            new Vector2(7,4),
            new Vector2(4,7),
            new Vector2(7,7),
        ],
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,0,0,_,_,0,0,_,_,0],
            [0,_,_,0,_,_,_,_,0,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,0,_,_,_,_,0,_,_,0],
            [0,_,_,0,0,_,_,0,0,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
        ]
    },
    {
        type: ROOM_TYPE.MID,
        spawnPoint: new Vector2(2,2),
        enemySpawnPoints: [
            new Vector2(3,2),
            new Vector2(8,2),
            new Vector2(3,9),
            new Vector2(8,9),
            new Vector2(11,2),
            new Vector2(16,2),
            new Vector2(11,9),
            new Vector2(16,9),
        ],
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,0,0,0,0,_,_,_,_,0,0,0,0,_,_,_,0],
            [0,_,_,_,0,_,_,0,_,_,_,_,0,_,_,0,_,_,_,0],
            [0,_,_,_,0,_,_,0,_,_,_,_,0,_,_,0,_,_,_,0],
            [0,_,_,_,0,0,0,0,_,_,_,_,0,0,0,0,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ],
    },
    // Large rooms - 22 and lower
    // Jumbo rooms - 36 and lower
]

export default roomData

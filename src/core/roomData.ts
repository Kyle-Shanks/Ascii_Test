import { NumMatrix, Vector2 } from 'src/core/types'

// To make the map data visually easier to read
const _ = null

export const ROOM_TYPE = {
    MINI: 'mini',
    SMALL: 'small',
    MID: 'mid',
    LARGE: 'large',
    JUMBO: 'jumbo',
} as const

export type RoomType = typeof ROOM_TYPE[keyof typeof ROOM_TYPE]

export type RoomInfo = {
    type: RoomType
    spawnPoint: Vector2
    itemSpawnPoint: Vector2 | null
    goldSpawnPoints: Vector2[]
    enemySpawnPoints: Vector2[]
    data: NumMatrix
}

// const roomData: Record<RoomType, RoomInfo[]> = {
const roomData: RoomInfo[] = [
    // Mini rooms - 6 and lower
    {
        type: ROOM_TYPE.MINI,
        spawnPoint: new Vector2(2,2),
        itemSpawnPoint: new Vector2(2,2),
        goldSpawnPoints: [
            new Vector2(1,1),
            new Vector2(2,2),
            new Vector2(3,3),
            new Vector2(1,3),
            new Vector2(3,1),
        ],
        enemySpawnPoints: [],
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
        spawnPoint: new Vector2(2,2),
        itemSpawnPoint: new Vector2(2,2),
        goldSpawnPoints: [
            new Vector2(2,1),
            new Vector2(1,2),
            new Vector2(3,2),
            new Vector2(2,3),
        ],
        enemySpawnPoints: [],
        data: [
            [0,0,0,0,0],
            [0,_,_,_,0],
            [0,_,_,_,0],
            [0,_,_,_,0],
            [0,0,0,0,0],
        ]
    },
    // {
    //     type: ROOM_TYPE.MINI,
    //     spawnPoint: new Vector2(2,1),
    //     itemSpawnPoint: null,
    //     enemySpawnPoints: [],
    //     data: [
    //         [0,0,0,0,0],
    //         [0,_,_,_,0],
    //         [0,_,0,_,0],
    //         [0,_,_,_,0],
    //         [0,0,0,0,0],
    //     ]
    // },
    {
        type: ROOM_TYPE.MINI,
        spawnPoint: new Vector2(4,2),
        itemSpawnPoint: new Vector2(4,2),
        goldSpawnPoints: [
            new Vector2(2,1),
            new Vector2(2,3),
            new Vector2(3,2),
            new Vector2(4,1),
            new Vector2(4,3),
            new Vector2(5,1),
            new Vector2(5,3),
            new Vector2(6,2),
            new Vector2(7,1),
            new Vector2(7,3),
        ],
        enemySpawnPoints: [
            new Vector2(3,2),
            new Vector2(6,2),
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
        spawnPoint: new Vector2(2,4),
        itemSpawnPoint: new Vector2(2,4),
        goldSpawnPoints: [
            new Vector2(1,2),
            new Vector2(3,2),
            new Vector2(2,3),
            new Vector2(1,4),
            new Vector2(3,4),
            new Vector2(1,5),
            new Vector2(3,5),
            new Vector2(2,6),
            new Vector2(1,7),
            new Vector2(3,7),
        ],
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
        spawnPoint: new Vector2(3,3),
        itemSpawnPoint: new Vector2(3,3),
        goldSpawnPoints: [],
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
        spawnPoint: new Vector2(7,3),
        itemSpawnPoint: new Vector2(7,3),
        goldSpawnPoints: [],
        enemySpawnPoints: [
            new Vector2(3,2),
            new Vector2(6,2),
            new Vector2(10,2),
            new Vector2(12,2),
            new Vector2(3,5),
            new Vector2(6,5),
            new Vector2(10,5),
            new Vector2(12,5),
        ],
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ]
    },
    {
        type: ROOM_TYPE.SMALL,
        spawnPoint: new Vector2(2,5),
        itemSpawnPoint: null,
        goldSpawnPoints: [],
        enemySpawnPoints: [
            new Vector2(2,2),
            new Vector2(5,2),
            new Vector2(10,5),
            new Vector2(13,5),
        ],
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,0,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0,_,_,_,0],
            [0,_,_,_,_,_,_,0,0,_,_,0,_,_,_,0],
            [0,_,_,_,0,_,_,0,0,_,_,_,_,_,_,0],
            [0,_,_,_,0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,0,_,_,_,_,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ]
    },
    {
        type: ROOM_TYPE.SMALL,
        spawnPoint: new Vector2(3,6),
        itemSpawnPoint: new Vector2(12,2),
        goldSpawnPoints: [],
        enemySpawnPoints: [
            new Vector2(2,2),
            new Vector2(6,2),
            new Vector2(9,6),
            new Vector2(13,6),
        ],
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,0,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,0,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,0,_,_,_,_,_,0],
            [0,0,0,1,0,0,0,_,_,0,0,0,1,0,0,0],
            [0,_,_,_,_,_,0,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,0,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,0,_,_,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ]
    },
    {
        type: ROOM_TYPE.SMALL,
        spawnPoint: new Vector2(2,2),
        itemSpawnPoint: null,
        goldSpawnPoints: [],
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
        itemSpawnPoint: null,
        goldSpawnPoints: [],
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
        itemSpawnPoint: new Vector2(5,5),
        goldSpawnPoints: [],
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
        spawnPoint: new Vector2(7,7),
        itemSpawnPoint: new Vector2(7,7),
        goldSpawnPoints: [],
        enemySpawnPoints: [
            new Vector2(6,6),
            new Vector2(9,6),
            new Vector2(6,9),
            new Vector2(9,9),
        ],
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,0,0,0,1,1,0,0,0],
            [0,_,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,0,_,_,_,_,_,_,0],
            [0,_,_,_,0,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
        ]
    },
    {
        type: ROOM_TYPE.MID,
        spawnPoint: new Vector2(5,5),
        itemSpawnPoint: new Vector2(5,5),
        goldSpawnPoints: [],
        // TODO: Fix these
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
            [0,_,_,0,0,0,0,0,0,_,_,0],
            [0,_,_,0,_,_,_,_,0,_,_,0],
            [0,_,_,1,_,_,_,_,1,_,_,0],
            [0,_,_,1,_,_,_,_,1,_,_,0],
            [0,_,_,0,_,_,_,_,0,_,_,0],
            [0,_,_,0,0,_,_,0,0,_,_,0],
            [0,_,_,_,0,_,_,0,_,_,_,0],
            [0,_,_,_,0,_,_,0,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
        ]
    },
    {
        type: ROOM_TYPE.MID,
        spawnPoint: new Vector2(2,5),
        itemSpawnPoint: null,
        goldSpawnPoints: [],
        enemySpawnPoints: [
            new Vector2(6,6),
            new Vector2(9,2),
        ],
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,0,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0,_,_,_,0],
            [0,_,_,_,0,0,0,1,1,0,0,0,_,_,_,0],
            [0,_,_,_,0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,0,_,_,_,_,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ]
    },
    {
        type: ROOM_TYPE.MID,
        spawnPoint: new Vector2(2,2),
        itemSpawnPoint: new Vector2(9,5),
        goldSpawnPoints: [],
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
    {
        type: ROOM_TYPE.MID,
        spawnPoint: new Vector2(5,2),
        itemSpawnPoint: new Vector2(4, 9),
        goldSpawnPoints: [],
        enemySpawnPoints: [
            new Vector2(4, 7),
            new Vector2(7, 7),
            new Vector2(4, 12),
            new Vector2(7, 12),
        ],
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,0,0,0,0,0,0,_,_,0],
            [0,_,_,0,0,0,0,0,0,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,0,0,_,_,_,_,0],
            [0,_,_,_,_,0,0,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,0,0,0,0,0,0,_,_,0],
            [0,_,_,0,0,0,0,0,0,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
        ]
    },
    // Large rooms - 22 and lower
    {
        type: ROOM_TYPE.LARGE,
        spawnPoint: new Vector2(9,10),
        itemSpawnPoint: null,
        goldSpawnPoints: [],
        enemySpawnPoints: [],
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ]
    },
    {
        type: ROOM_TYPE.LARGE,
        spawnPoint: new Vector2(9,10),
        itemSpawnPoint: null,
        goldSpawnPoints: [],
        enemySpawnPoints: [],
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,0,0,0,0,_,_,_,_,_,_,0,0,0,0,_,_,_,0],
            [0,_,_,_,0,_,_,0,_,_,_,_,_,_,0,_,_,0,_,_,_,0],
            [0,_,_,_,0,_,_,0,_,_,_,_,_,_,0,_,_,0,_,_,_,0],
            [0,_,_,_,0,0,0,0,_,_,_,_,_,_,0,0,0,0,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,0,0,0,0,_,_,_,_,_,_,0,0,0,0,_,_,_,0],
            [0,_,_,_,0,_,_,0,_,_,_,_,_,_,0,_,_,0,_,_,_,0],
            [0,_,_,_,0,_,_,0,_,_,_,_,_,_,0,_,_,0,_,_,_,0],
            [0,_,_,_,0,0,0,0,_,_,_,_,_,_,0,0,0,0,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ]
    },
    // Jumbo rooms - 36 and lower
]

export default roomData

import { CHARS, EntityChar } from 'src/core/constants'
import { Stats } from 'src/core/types'

export const ENEMY_TYPE = {
    RAT: 'Rat',
    KOBOLD: 'Kobold',
    ZOMBIE: 'Zombie',
} as const

export type EnemyType = typeof ENEMY_TYPE[keyof typeof ENEMY_TYPE]

type EnemyInfo = {
    char: EntityChar
    moveSpeed: number
    vision: number
    stats: Stats
}

export const enemyStatsMap: Record<EnemyType, EnemyInfo> = {
    [ENEMY_TYPE.RAT]: {
        char: CHARS.R,
        moveSpeed: 1,
        vision: 7,
        stats: {
            HP: 2,
            STR: 1,
            DEF: 0,
            ACC: 70,
        },
    },
    [ENEMY_TYPE.KOBOLD]: {
        char: CHARS.K,
        moveSpeed: 1,
        vision: 7,
        stats: {
            HP: 4,
            STR: 2,
            DEF: 0,
            ACC: 80,
        },
    },
    [ENEMY_TYPE.ZOMBIE]: {
        char: CHARS.Z,
        moveSpeed: 2,
        vision: 7,
        stats: {
            HP: 6,
            STR: 4,
            DEF: 1,
            ACC: 85,
        },
    },
}

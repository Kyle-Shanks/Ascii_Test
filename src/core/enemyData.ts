import { CHARS, EntityChar } from 'src/core/constants'
import { Stats } from 'src/core/types'

export const ENEMY_TYPE = {
    RAT: 'Rat',
    KOBOLD: 'Kobold',
} as const

export type EnemyType = typeof ENEMY_TYPE[keyof typeof ENEMY_TYPE]

type EnemyInfo = {
    char: EntityChar
    moveSpeed: number
    stats: Stats
}

export const enemyStatsMap: Record<EnemyType, EnemyInfo> = {
    [ENEMY_TYPE.RAT]: {
        char: CHARS.R,
        moveSpeed: 1,
        stats: {
            HP: 1,
            STR: 1,
            DEF: 0,
            ACC: 70,
        },
    },
    [ENEMY_TYPE.KOBOLD]: {
        char: CHARS.K,
        moveSpeed: 2,
        stats: {
            HP: 3,
            STR: 1,
            DEF: 0,
            ACC: 80,
        },
    },
}

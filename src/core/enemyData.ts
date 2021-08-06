import { CHARS, EntityChar } from 'src/core/constants'
import { Stats } from 'src/core/types'

export const ENEMY_TYPE = {
    RAT: 'Rat',
    KOBOLD: 'Kobold',
} as const

export type EnemyType = typeof ENEMY_TYPE[keyof typeof ENEMY_TYPE]

type EnemyInfo = {
    char: EntityChar
    stats: Stats
}

export const enemyStatsMap: Record<EnemyType, EnemyInfo> = {
    [ENEMY_TYPE.RAT]: {
        char: CHARS.R,
        stats: {
            HP: 1,
            STR: 1,
            DEF: 0,
            SPD: 1,
            ACC: 70,
        },
    },
    [ENEMY_TYPE.KOBOLD]: {
        char: CHARS.K,
        stats: {
            HP: 3,
            STR: 1,
            DEF: 0,
            SPD: 1,
            ACC: 80,
        },
    },
}

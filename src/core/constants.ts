// Grid Constants
export const GRID_SIZE = 30
export const GRID_PAD = GRID_SIZE

// Canvas constants
export const CNV = document.getElementById('cnv') as HTMLCanvasElement
export const CTX = CNV.getContext('2d') as CanvasRenderingContext2D
export const CONTAINER = document.getElementById('cnvContainer') as HTMLDivElement

// Entity Characters
export const CHARS = {
    DOT:      '·',
    AT:       '@',
    HASH:     '#',
    DOLLAR:   '$',
    STAR:     '*',
    TILDE:    '~',
    PERIOD:   '.',
    QUESTION: '?',
    PLUS:     '+',
    DASH:     '-',
    PIPE:     '|',
} as const

export type EntityChar = typeof CHARS[keyof typeof CHARS]

export const ENTITY_TYPES = {
    DEFAULT: 'Entity',
    ACTOR: 'Actor',
    PLAYER: 'Player',
    WALL: 'Wall',
} as const

export type EntityType = typeof ENTITY_TYPES[keyof typeof ENTITY_TYPES]

export const TYPE_CHAR_MAP: Record<EntityType, EntityChar> = {
    [ENTITY_TYPES.ACTOR]: CHARS.DOLLAR,
    [ENTITY_TYPES.DEFAULT]: CHARS.QUESTION,
    [ENTITY_TYPES.PLAYER]: CHARS.AT,
    [ENTITY_TYPES.WALL]: CHARS.HASH,
} as const

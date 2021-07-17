export const GRID_SIZE = 30

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

// Common interfaces
export type Position = {
    x: number
    y: number
}

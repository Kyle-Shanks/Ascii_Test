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
    COMMA:    ',',
    SEMI:     ';',
    COLON:    ':',
    AT:       '@',
    HASH:     '#',
    DOLLAR:   '$',
    STAR:     '*',
    TILDE:    '~',
    PERIOD:   '.',
    QUESTION: '?',
    EXCLAM:   '!',
    PLUS:     '+',
    DASH:     '-',
    EQUAL:    '=',
    PIPE:     '|',
    UP:       '^',
    DOWN:     'v',
    LT:       '<',
    GT:       '>',

    // Characters for enemies
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    E: 'E',
    F: 'F',
    G: 'G',
    H: 'H',
    I: 'I',
    J: 'J',
    K: 'K',
    L: 'L',
    M: 'M',
    N: 'N',
    O: 'O',
    P: 'P',
    Q: 'Q',
    R: 'R',
    S: 'S',
    T: 'T',
    U: 'U',
    V: 'V',
    W: 'W',
    X: 'X',
    Y: 'Y',
    Z: 'Z',
} as const

export type EntityChar = typeof CHARS[keyof typeof CHARS]

export const ENTITY_TYPES = {
    DEFAULT: 'Entity',
    ACTOR: 'Actor',
    PLAYER: 'Player',
    ENEMY: 'Enemy',
    WALL: 'Wall',
    DOT: 'Dot',
    DOOR: 'Door',
    KEY: 'Key',
    PORTAL: 'Portal',
    GOLD: 'Gold',
} as const

export type EntityType = typeof ENTITY_TYPES[keyof typeof ENTITY_TYPES]

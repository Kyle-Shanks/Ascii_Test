const Theme = {
    LIGHT: 'Light',
    DARK: 'Dark',
} as const

type Theme = typeof Theme[keyof typeof Theme]

interface ThemeColors {
    background: string,
    low: string,
    high: string,
    pop: string,
}

const THEME: Record<Theme, ThemeColors> = {
    [Theme.DARK]: {
        background: '#2a303c',
        low: '#464e5f',
        high: '#e2e8f0',
        pop: '#4ca2a1',
    },
    [Theme.LIGHT]: {
        background: '#ffffff',
        low: '#cbd5e0',
        high: '#2d3748',
        pop: '#ef9433',
    },
}

export default THEME

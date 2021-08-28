export const THEME = {
    DARK: 'Dark',
    MIDNIGHT: 'Midnight',
    AFTERGLOW: 'Afterglow',
    MUTED: 'Muted',
    ZEN: 'Zen',
    SEAFOAM: 'Seafoam',
    NORD: 'Nord',
    ROCK: 'Rock',
    CMYK: 'CMYK',
    BLUE: 'Blue',
    COQ: 'CoQ',
} as const

type Theme = typeof THEME[keyof typeof THEME]

export const THEME_COLOR = {
    BACKGROUND: 'background',
    LOW: 'low',
    HIGH: 'high',
    ACCENT: 'accent',
    DANGER: 'danger',
    POP: 'pop',
} as const

export type ThemeColor = typeof THEME_COLOR[keyof typeof THEME_COLOR]

type ThemeColors = Record<ThemeColor, string>

class ThemeManager {
    public currentTheme: Theme

    private themeMap: Record<Theme, ThemeColors> = {
        [THEME.COQ]: {
            background: '#10393b',
            low: '#225251',
            high: '#b8d5cb',
            accent: '#d6c344',
            pop: '#0094f0',
            danger: '#c74706',
        },
        [THEME.BLUE]: {
            background: '#1c2b35',
            low: '#2a5055',
            high: '#6fc3c3',
            accent: '#fac863',
            pop: '#fac863',
            danger: '#fa6863',
        },
        [THEME.CMYK]: {
            background: '#000000',
            low: '#333333',
            high: '#dddddd',
            accent: '#ffff00',
            pop: '#00ffff',
            danger: '#ff00ff',
        },
        [THEME.ROCK]: {
            background: '#232323',
            low: '#484848',
            high: '#d7c8bb',
            accent: '#a99174',
            pop: '#8c8c8c',
            danger: '#a95552',
        },
        [THEME.NORD]: {
            background: '#2f3541',
            low: '#3b4353',
            high: '#e5e9ef',
            accent: '#ebcb8b',
            pop: '#88bfd0',
            danger: '#bf616a',
        },
        [THEME.SEAFOAM]: {
            background: '#243536',
            low: '#446456',
            high: '#e0e0e0',
            accent: '#fae79d',
            pop: '#7ac3cf',
            danger: '#cf937a',
        },
        [THEME.ZEN]: {
            background: '#404040',
            low: '#4e4e4e',
            high: '#dcdccb',
            accent: '#e0cf9e',
            pop: '#6f9080',
            danger: '#dc8cc3',
        },
        [THEME.MUTED]: {
            background: '#343434',
            low: '#5a5a5a',
            high: '#cccccc',
            accent: '#ffb380',
            pop: '#86deaa',
            danger: '#ff8080',
        },
        [THEME.AFTERGLOW]: {
            background: '#232323',
            low: '#414141',
            high: '#d0d0d0',
            accent: '#d3a04e',
            pop: '#7a9147',
            danger: '#9f4e84',
        },
        [THEME.MIDNIGHT]: {
            background: '#0F0F14',
            low: '#31333E',
            high: '#8CB5B9',
            accent: '#CEC675',
            pop: '#5EB17E',
            danger: '#D57EC0',
        },
        [THEME.DARK]: {
            background: '#2a303c',
            low: '#464e5f',
            high: '#e2e8f0',
            accent: '#eec323',
            pop: '#4cc2c1',
            danger: '#ff6347',
        },
    }

    constructor(initTheme: Theme = THEME.COQ) {
        this.currentTheme = initTheme
    }

    public getTheme = (): Theme => this.currentTheme
    public setTheme = (theme: Theme): Theme => this.currentTheme = theme

    public getColors = (): ThemeColors => this.themeMap[this.currentTheme]
}

export default ThemeManager

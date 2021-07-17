const THEME = {
    LIGHT: 'Light',
    DARK: 'Dark',
} as const

type Theme = typeof THEME[keyof typeof THEME]

export const THEME_COLOR = {
    BACKGROUND: 'background',
    LOW: 'low',
    HIGH: 'high',
    POP: 'pop',
} as const

export type ThemeColor = typeof THEME_COLOR[keyof typeof THEME_COLOR]

type ThemeColors = Record<ThemeColor, string>

class ThemeManager {
    public currentTheme: Theme

    private themeMap: Record<Theme, ThemeColors> = {
        [THEME.DARK]: {
            background: '#2a303c',
            low: '#464e5f',
            high: '#e2e8f0',
            pop: '#4ca2a1',
        },
        [THEME.LIGHT]: {
            background: '#ffffff',
            low: '#cbd5e0',
            high: '#2d3748',
            pop: '#ef9433',
        },
    }

    constructor(initTheme: Theme = THEME.DARK) {
        this.currentTheme = initTheme
    }

    public getTheme = (): Theme => this.currentTheme
    public setTheme = (theme: Theme): Theme => this.currentTheme = theme

    public getColors = (): ThemeColors => this.themeMap[this.currentTheme]
}

export default ThemeManager

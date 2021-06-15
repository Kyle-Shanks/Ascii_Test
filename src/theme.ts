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

class ThemeManager {
    public currentTheme: Theme

    private themeMap: Record<Theme, ThemeColors> = {
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

    constructor(initTheme: Theme = Theme.DARK) {
        this.currentTheme = initTheme
    }

    public getTheme = (): Theme => this.currentTheme
    public setTheme = (theme: Theme): Theme => this.currentTheme = theme

    public getColors = (): ThemeColors => this.themeMap[this.currentTheme]
}

export default ThemeManager

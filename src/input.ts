const InputKeys = {
    W: 'w',
    A: 'a',
    S: 's',
    D: 'd',
    J: 'j',
    K: 'k',
    Shift: 'Shift',
    Space: ' ',
} as const

type InputKeys = keyof typeof InputKeys

class Input {
    readonly keys: Record<InputKeys, boolean> = {
        W: false,
        A: false,
        S: false,
        D: false,
        J: false,
        K: false,
        Shift: false,
        Space: false,
    }

    constructor() {}

    public getKeys = () => this.keys

    private keydownHandler = (e: KeyboardEvent) => {
        if (e.repeat) return
        e.preventDefault()

        switch (e.key) {
            case InputKeys.W:
                this.keys.W = true
                break
            case InputKeys.A:
                this.keys.A = true
                break
            case InputKeys.S:
                this.keys.D = true
                break
            case InputKeys.D:
                this.keys.D = true
                break
            case InputKeys.J:
                this.keys.J = true
                break
            case InputKeys.K:
                this.keys.K = true
                break
            case InputKeys.Shift:
                this.keys.Shift = true
                break
            case InputKeys.Space:
                this.keys.Space = true
                break
        }
    }

    private keyupHandler = (e: KeyboardEvent) => {
        e.preventDefault()

        switch (e.key) {
            case InputKeys.W:
                this.keys.W = false
                break
            case InputKeys.A:
                this.keys.A = false
                break
            case InputKeys.S:
                this.keys.D = false
                break
            case InputKeys.D:
                this.keys.D = false
                break
            case InputKeys.J:
                this.keys.J = false
                break
            case InputKeys.K:
                this.keys.K = false
                break
            case InputKeys.Shift:
                this.keys.Shift = false
                break
            case InputKeys.Space:
                this.keys.Space = false
                break
        }
    }

    public listen = () => {
        document.addEventListener('keydown', this.keydownHandler)
        document.addEventListener('keyup', this.keyupHandler)
    }

    public stop = () => {
        document.removeEventListener('keydown', this.keydownHandler)
        document.removeEventListener('keyup', this.keyupHandler)
    }
}

export default Input

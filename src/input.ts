const inputKeys = ['w', 'a', 's', 'd', 'j', 'k', 'shift', 'space'] as const
type InputKeys = (typeof inputKeys)[number] // Get union type from const

class Input {
    readonly keys: Record<InputKeys, boolean> = {
        w: false,
        a: false,
        s: false,
        d: false,
        j: false,
        k: false,
        shift: false,
        space: false,
    }

    getKeys = () => this.keys

    private keydownHandler = (e: KeyboardEvent) => {
        if (e.repeat) return
        e.preventDefault()

        switch (e.key) {
            case 'w':
                this.keys.w = true
                break
            case 'a':
                this.keys.a = true
                break
            case 's':
                this.keys.s = true
                break
            case 'd':
                this.keys.d = true
                break
            case 'j':
                this.keys.j = true
                break
            case 'k':
                this.keys.k = true
                break
            case 'Shift':
                this.keys.shift = true
                break
            case ' ':
                this.keys.space = true
                break
        }
    }

    private keyupHandler = (e: KeyboardEvent) => {
        e.preventDefault()

        switch (e.key) {
            case 'w':
                this.keys.w = false
                break
            case 'a':
                this.keys.a = false
                break
            case 's':
                this.keys.s = false
                break
            case 'd':
                this.keys.d = false
                break
            case 'j':
                this.keys.j = false
                break
            case 'k':
                this.keys.k = false
                break
            case 'Shift':
                this.keys.shift = false
                break
            case ' ':
                this.keys.space = false
                break
        }
    }

    constructor() {}

    listen = () => {
        document.addEventListener('keydown', this.keydownHandler)
        document.addEventListener('keyup', this.keyupHandler)
    }
    stop = () => {
        document.removeEventListener('keydown', this.keydownHandler)
        document.removeEventListener('keyup', this.keyupHandler)
    }
}

export default Input

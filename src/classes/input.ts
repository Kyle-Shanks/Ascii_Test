// Map of key options to event.key values
const InputKey = {
    W: 'w',
    A: 'a',
    S: 's',
    D: 'd',
    J: 'j',
    K: 'k',
    Shift: 'shift',
    Space: ' ',
} as const

export type InputKey = keyof typeof InputKey

const InputEventType = {
    PRESS: 'press',
    RELEASE: 'release',
} as const

type InputEventType = typeof InputEventType[keyof typeof InputEventType]

export interface InputEvent {
    key: InputKey
    type: InputEventType
}

export interface InputObserver {
    id: string
    update(event: InputEvent): void
}

interface BaseInput {
    readonly keys: Record<InputKey, boolean>
    getKeys(): Record<InputKey, boolean>
    subscribe(observer: InputObserver): void
    unsubscribe(observer: InputObserver): void
    notify(event: InputEvent): void
    listen(): void
    stop(): void
}

export type InputState = Record<InputKey, boolean>

class Input implements BaseInput {
    readonly keys: InputState = {
        W: false,
        A: false,
        S: false,
        D: false,
        J: false,
        K: false,
        Shift: false,
        Space: false,
    }

    private observers: InputObserver[] = []

    public getKeys = () => this.keys

    // Start listening to input
    public listen = () => {
        document.addEventListener('keydown', this.keydownHandler)
        document.addEventListener('keyup', this.keyupHandler)
    }

    // Stop listening to input
    public stop = () => {
        document.removeEventListener('keydown', this.keydownHandler)
        document.removeEventListener('keyup', this.keyupHandler)
    }

    // Pub/Sub methods
    public subscribe = (observer: InputObserver) => {
        this.observers.push(observer)
    }

    public unsubscribe = (observer: InputObserver) => {
        this.observers = this.observers.filter((ob) => ob.id !== observer.id)
    }

    public notify = (event: InputEvent) => {
        this.observers.forEach((observer) => observer.update(event))
    }

    // Input handler methods
    private _handleKeyDown = (key: InputKey) => {
        this.keys[key] = true
        this.notify({ key, type: InputEventType.PRESS })
    }

    private _handleKeyUp = (key: InputKey) => {
        this.keys[key] = false
        this.notify({ key, type: InputEventType.RELEASE })
    }

    private keydownHandler = (e: KeyboardEvent) => {
        if (e.repeat) return
        e.preventDefault()

        switch (e.key.toLowerCase()) {
            case InputKey.W:
                this._handleKeyDown('W')
                break
            case InputKey.A:
                this._handleKeyDown('A')
                break
            case InputKey.S:
                this._handleKeyDown('S')
                break
            case InputKey.D:
                this._handleKeyDown('D')
                break
            case InputKey.J:
                this._handleKeyDown('J')
                break
            case InputKey.K:
                this._handleKeyDown('K')
                break
            case InputKey.Shift:
                this._handleKeyDown('Shift')
                break
            case InputKey.Space:
                this._handleKeyDown('Space')
                break
        }
    }

    private keyupHandler = (e: KeyboardEvent) => {
        e.preventDefault()

        switch (e.key.toLowerCase()) {
            case InputKey.W:
                this._handleKeyUp('W')
                break
            case InputKey.A:
                this._handleKeyUp('A')
                break
            case InputKey.S:
                this._handleKeyUp('S')
                break
            case InputKey.D:
                this._handleKeyUp('D')
                break
            case InputKey.J:
                this._handleKeyUp('J')
                break
            case InputKey.K:
                this._handleKeyUp('K')
                break
            case InputKey.Shift:
                this._handleKeyUp('Shift')
                break
            case InputKey.Space:
                this._handleKeyUp('Space')
                break
        }
    }
}

export default Input

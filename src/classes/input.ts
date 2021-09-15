enum InputKey {
    W = 'w',
    A = 'a',
    S = 's',
    D = 'd',
    J = 'j',
    K = 'k',
    SHIFT = 'shift',
    SPACE = ' ',
}

const isInputKey = (key: any): key is InputKey => Object.values(InputKey).includes(key)

export enum Button {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    A = 'A',
    B = 'B',
    SELECT = 'SELECT',
    START = 'START',
}

const inputKeyButtonMap: Record<InputKey, Button> = {
    [InputKey.W]: Button.UP,
    [InputKey.A]: Button.LEFT,
    [InputKey.S]: Button.DOWN,
    [InputKey.D]: Button.RIGHT,
    [InputKey.J]: Button.B,
    [InputKey.K]: Button.A,
    [InputKey.SHIFT]: Button.SELECT,
    [InputKey.SPACE]: Button.START,
}

export enum InputType {
    PRESS = 'PRESS',
    RELEASE = 'RELEASE',
}

export type InputEvent = {
    button: Button
    type: InputType
}

export type InputObserver = {
    id: string
    update: (event: InputEvent) => void
}

class InputManager {
    public state: Record<Button, boolean>
    private observers: InputObserver[] = []

    constructor() {
        this.state = {
            [Button.UP]: false,
            [Button.DOWN]: false,
            [Button.LEFT]: false,
            [Button.RIGHT]: false,
            [Button.A]: false,
            [Button.B]: false,
            [Button.SELECT]: false,
            [Button.START]: false,
        }
    }

    public getState = () => this.state

    // Start listening to input
    public start = () => {
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
    private keydownHandler = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase()

        if (!e.repeat && isInputKey(key)) {
            e.preventDefault()
            const button = inputKeyButtonMap[key]
            this.state[button] = true
            this.notify({ button, type: InputType.PRESS })
        }
    }

    private keyupHandler = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase()

        if (isInputKey(key)) {
            e.preventDefault()
            const button = inputKeyButtonMap[key]
            this.state[button] = false
            this.notify({ button, type: InputType.RELEASE })
        }
    }
}

export default InputManager

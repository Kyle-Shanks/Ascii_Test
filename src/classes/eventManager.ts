export const GAME_EVENT_TYPE = {
    HIT: 'hit'
} as const

type GameEventType = typeof GAME_EVENT_TYPE[keyof typeof GAME_EVENT_TYPE]

export type GameEvent = {
    type: GameEventType
}

export type GameEventHandler = {
    type: GameEventType
    func: Function
}

class EventManager {
    private handlers: Partial<Record<GameEventType, GameEventHandler>>

    constructor() {
        this.handlers = {}
    }

    dispatch = (type: GameEventType) => this.handlers[type]?.func()

    addHandler = (handler: GameEventHandler) => this.handlers[handler.type] = handler
    removeHandler = (type: GameEventType) => delete this.handlers[type]
}

export default EventManager

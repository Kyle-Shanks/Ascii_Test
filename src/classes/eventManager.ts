export const GAME_EVENT_TYPE = {
    PLAYER_DAMAGED: 'player_damaged',
    PLAYER_ACTION: 'player_action',
    PLAYER_MOVE: 'player_move',
} as const

type GameEventType = typeof GAME_EVENT_TYPE[keyof typeof GAME_EVENT_TYPE]

type GameEvent = {
    type: GameEventType
}

type GameEventHandler = {
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

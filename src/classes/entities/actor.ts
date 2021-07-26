import Entity, { EntityProps } from 'src/classes/entities/entity'
import { THEME_COLOR } from 'src/classes/theme'
import { ENTITY_TYPES } from 'src/core/constants'

export interface ActorProps extends EntityProps {
    // Any actor specific props go here
}

class Actor extends Entity {
    update!: Function

    constructor(props: ActorProps) {
        super(props)
        this.type = ENTITY_TYPES.ACTOR
    }
}

export default Actor

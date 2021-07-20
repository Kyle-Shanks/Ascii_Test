import { Vector2 } from 'src/core/types'

type CameraProps = {
    position?: Vector2
}

class Camera {
    position: Vector2 = Vector2.ZERO

    constructor(props?: CameraProps) {
        this.position = props?.position ?? this.position
    }

    updatePosition = (pos: Vector2) => {
        // TODO: Add camera padding system
        // Should only update position if the player is close to the edge
        this.position = pos
    }
}

export default Camera

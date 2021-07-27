import { GRID_SIZE } from 'src/core/constants'
import { Vector2 } from 'src/core/types'

type CameraProps = {
    position?: Vector2
}

// TODO: Move this
const lerp = (start: number, end: number, amt: number = 0.1) => (
    (1 - amt) * start + amt * end
)

class Camera {
    position: Vector2 = Vector2.ZERO
    absPosition: Vector2 = Vector2.ZERO

    constructor(props?: CameraProps) {
        this.position = props?.position ?? this.position
        this.absPosition = this.position.multiply(GRID_SIZE)
    }

    setPosition = (pos: Vector2) => this.position = pos

    update = () => {
        this.absPosition = this.absPosition.lerp(this.position.multiply(GRID_SIZE), 0.1)
    }
}

export default Camera

import { CNV, GRID_PAD, GRID_SIZE } from 'src/core/constants'
import { Vector2 } from 'src/core/types'

// Camera offset to center camera to the center of the canvas
const offsetX = (CNV.width - GRID_PAD * 2) / (GRID_SIZE * 2)
const offsetY = (CNV.height - GRID_PAD * 2) / (GRID_SIZE * 2)
const cameraOffset = new Vector2(offsetX, offsetY)

type CameraProps = {
    position?: Vector2
}

class Camera {
    position: Vector2 = Vector2.ZERO
    absPosition: Vector2 = Vector2.ZERO

    constructor(props?: CameraProps) {
        this.position = props?.position ?? this.position
        this.absPosition = this.position.multiply(GRID_SIZE)
    }

    setPosition = (pos: Vector2) => this.position = pos.subtract(cameraOffset)
    resetPosition = (pos: Vector2) => {
        this.setPosition(pos)
        this.absPosition = this.position.multiply(GRID_SIZE)
    }

    update = () => {
        this.absPosition = this.absPosition.lerp(this.position.multiply(GRID_SIZE), 0.1)
    }
}

export default Camera

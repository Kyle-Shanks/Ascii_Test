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
    shakePosition: Vector2 = Vector2.ZERO
    private shakeTimer: number

    constructor(props?: CameraProps) {
        this.position = props?.position ?? this.position
        this.absPosition = this.position.multiply(GRID_SIZE)
        this.shakeTimer = 0
    }

    setPosition = (pos: Vector2) => this.position = pos.subtract(cameraOffset)
    resetPosition = (pos: Vector2) => {
        this.setPosition(pos)
        this.absPosition = this.position.multiply(GRID_SIZE)
    }

    shake = (amt: number = 6) => {
        const x = Math.random() > 0.5 ? 1 : -1
        const y = (Math.random() * 0.6) - 0.3
        const shakeVector = new Vector2(x, y).normalize().multiply(amt)
        this.shakePosition = this.shakePosition.add(shakeVector)
    }

    update = () => {
        this.absPosition = this.absPosition.lerp(this.position.multiply(GRID_SIZE)).add(this.shakePosition)
        if (!this.shakePosition.isEqual(Vector2.ZERO)) this.updateShake()
    }

    private updateShake = () => {
        if (this.shakeTimer === 0) {
            const minValue = 0.8
            this.shakePosition = this.shakePosition.lerp(Vector2.ZERO, 1.7)
            if (Math.abs(this.shakePosition.x) < minValue && Math.abs(this.shakePosition.y) < minValue) {
                this.shakePosition = Vector2.ZERO
            }
        }
        this.shakeTimer = (this.shakeTimer + 1) % 3
    }
}

export default Camera

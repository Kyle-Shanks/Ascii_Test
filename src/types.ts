import { CNV, GRID_PAD, GRID_SIZE } from './constants'

// Common types
export class Vector2 {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    static ZERO = new Vector2(0, 0)
    static UP = new Vector2(0, -1)
    static DOWN = new Vector2(0, 1)
    static LEFT = new Vector2(-1, 0)
    static RIGHT = new Vector2(1, 0)

    add = (vec: Vector2): Vector2 => (
        new Vector2(this.x + vec.x, this.y + vec.y)
    )
    subtract = (vec: Vector2): Vector2 => (
        new Vector2(this.x - vec.x, this.y - vec.y)
    )
    multiply = (num: number): Vector2 => (
        new Vector2(this.x * num, this.y * num)
    )
    divide = (num: number): Vector2 => (
        new Vector2(this.x / num, this.y / num)
    )

    isEqual = (vec: Vector2): boolean => (
        this.x === vec.x && this.y === vec.y
    )

    isOutsideGrid = (): boolean => (
        this.x < 0
        || this.y < 0
        || this.x > ((CNV.width - GRID_PAD * 2) / GRID_SIZE)
        || this.y > ((CNV.height - GRID_PAD * 2) / GRID_SIZE)
    )
}

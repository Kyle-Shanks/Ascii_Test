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

    length = (): number => this.distanceTo(Vector2.ZERO)
    normalize = (): Vector2 => this.divide(this.length())
    distanceTo = (vec: Vector2): number => (
        Math.sqrt((vec.x - this.x) ** 2 + (vec.y - this.y) ** 2)
    )
    angleTo = (vec: Vector2): number => {
        const angle = Math.atan2(vec.y - this.y, vec.x - this.x) * 180 / Math.PI
        return angle < 0 ? angle + 360 : angle
    }

    getAtDistance = (dist: number): Vector2[] => {
        const maxDist = Math.ceil(dist)
        const vecArr: Vector2[] = []

        for (let x = this.x - maxDist; x <= this.x + maxDist; x++) {
            for (let y = this.y - maxDist; y <= this.y + maxDist; y++) {
                const vec = new Vector2(x, y)
                if (this.distanceTo(vec) <= dist && this.distanceTo(vec) > dist - 1) vecArr.push(vec)
            }
        }

        return vecArr.sort((a, b) => a.distanceTo(this) - b.distanceTo(this))
    }
    getWithinDistance = (dist: number): Vector2[] => {
        const maxDist = Math.ceil(dist)
        const vecArr: Vector2[] = []

        for (let x = this.x - maxDist; x <= this.x + maxDist; x++) {
            for (let y = this.y - maxDist; y <= this.y + maxDist; y++) {
                const vec = new Vector2(x, y)
                if (this.distanceTo(vec) <= dist) vecArr.push(vec)
            }
        }

        return vecArr.sort((a,b) => a.distanceTo(this) - b.distanceTo(this))
    }

    bresenham = (pos: Vector2): Vector2[] => {
        const arr = []
        let start = new Vector2(this.x, this.y)
        const dx = Math.abs(pos.x - start.x)
        const dy = Math.abs(pos.y - start.y)
        const sx = start.x < pos.x ? Vector2.RIGHT : Vector2.LEFT
        const sy = start.y < pos.y ? Vector2.DOWN : Vector2.UP

        let err = dx - dy

        while (true) {
            arr.push(start)

            if (start.isEqual(pos)) break
            const err2 = err * 2

            if (err2 > -dy) {
                err -= dy
                start = start.add(sx)
            }
            if (err2 < dx) {
                err += dx
                start = start.add(sy)
            }
        }

        return arr
    }
}

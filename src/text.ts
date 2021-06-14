import { CTX } from './globals'

interface Position {
    x: number,
    y: number,
}

interface TextProps {
    pos: Position,
    msg: string,
    size: number
}

// - Text Class -
class Text {
    pos: { x: number, y: number }
    msg: string
    size: number

    constructor(props: TextProps) {
        this.pos = props.pos
        this.msg = props.msg
        this.size = props.size
    }

    draw() {
        // TODO: Get high contrast color from theme
        CTX.fillStyle = 'black'
        CTX.font = `${this.size}px monospace`
        CTX.textAlign = 'center'
        CTX.textBaseline = 'middle'
        // CTX.fillText(this.msg, this.pos.x - camera.pos.x, this.pos.y - camera.pos.y)
        CTX.fillText(this.msg, this.pos.x, this.pos.y)
    }
}

export default Text

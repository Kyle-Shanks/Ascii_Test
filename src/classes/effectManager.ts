import { FX_CNV, FX_CTX } from "src/core/constants"

export const EFFECT = {
    NONE: 'None',
    CRT: 'CRT',
} as const

type Effect = typeof EFFECT[keyof typeof EFFECT]

class EffectManager {
    public currentEffect: Effect

    constructor(initEffect: Effect = EFFECT.NONE) {
        this.currentEffect = initEffect
    }

    public getEffect = (): Effect => this.currentEffect

    public setEffect = (effect: Effect): Effect => {
        this.currentEffect = effect

        switch (this.currentEffect) {
            case EFFECT.NONE:
                this.clearEffect()
                break
            case EFFECT.CRT:
                this.drawCrtEffect()
                break
        }

        return this.currentEffect
    }

    private clearEffect = () => FX_CTX.clearRect(0, 0, FX_CNV.width, FX_CNV.height)

    private drawCrtEffect = () => {
        this.clearEffect()

        const lineWidth = 3.5
        FX_CTX.fillStyle = `rgba(0,0,0,0.11)`

        // Lines
        for (let i = 0; i < FX_CNV.height; i += lineWidth * 2) {
            FX_CTX.fillRect(0, i, FX_CNV.width, lineWidth)
        }

        // Vignette Gradients
        // Horizontal Gradient
        const hGrad = FX_CTX.createLinearGradient(0, 0, FX_CNV.width, 0)

        hGrad.addColorStop(0, 'rgba(0,0,0,0.18)')
        hGrad.addColorStop(0.05, 'rgba(0,0,0,0.05)')
        hGrad.addColorStop(0.1, 'rgba(0,0,0,0)')
        hGrad.addColorStop(0.9, 'rgba(0,0,0,0)')
        hGrad.addColorStop(0.95, 'rgba(0,0,0,0.05)')
        hGrad.addColorStop(1, 'rgba(0,0,0,0.18)')

        FX_CTX.fillStyle = hGrad
        FX_CTX.fillRect(0, 0, FX_CNV.width, FX_CNV.height)

        // Vertical Gradient
        const vGrad = FX_CTX.createLinearGradient(0, 0, 0, FX_CNV.height)

        vGrad.addColorStop(0, 'rgba(0,0,0,0.15)')
        vGrad.addColorStop(0.05, 'rgba(0,0,0,0.05)')
        vGrad.addColorStop(0.1, 'rgba(0,0,0,0)')
        vGrad.addColorStop(0.9, 'rgba(0,0,0,0)')
        vGrad.addColorStop(0.95, 'rgba(0,0,0,0.05)')
        vGrad.addColorStop(1, 'rgba(0,0,0,0.15)')

        FX_CTX.fillStyle = vGrad
        FX_CTX.fillRect(0, 0, FX_CNV.width, FX_CNV.height)
    }
}

export default EffectManager

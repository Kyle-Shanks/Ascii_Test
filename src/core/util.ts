export const lerp = (start: number, end: number, amt: number = 0.1) => (
    start + (end - start) * amt
)

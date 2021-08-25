export const lerp = (start: number, end: number, amt: number = 0.1) => (
    start + (end - start) * amt
)

/**
 * Return random integer between zero and num
 */
export const rand = (num: number): number => Math.floor(Math.random() * num)

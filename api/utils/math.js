export function computeCircumference(radius) {
    return 2 * Math.pi * radius
}

export function computeSquarePerimetter(side){
    if (side < 0) {
        throw new Error('Negative error')
    }
    return 4 * side;
}

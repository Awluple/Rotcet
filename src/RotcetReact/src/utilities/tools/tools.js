export const addZeroForBelowTen = number => {
    // adds zero for numbers below ten >> 9 -> 09
    return number < 10 ? '0' + number : number
}
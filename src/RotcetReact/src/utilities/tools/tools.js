export const addZeroForBelowTen = number => {
    // adds zero for numbers below ten >> 9 -> 09
    return number < 10 ? '0' + number : number
}

export const toCompactDate = date => {
    const day = addZeroForBelowTen(date.getDate())
    const month = addZeroForBelowTen(date.getMonth() + 1)
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
}

export const toCompactHour = date => {
    const hour = addZeroForBelowTen(date.getHours())
    const minutes = addZeroForBelowTen(date.getMinutes())

    return `${hour}:${minutes}`
}

export const fromCompactDateToJSObject = date => {
    date = date.split('.')
    date = new Date(date[2], parseInt(date[1]) - 1, date[0])

    return date
}
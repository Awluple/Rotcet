import {addZeroForBelowTen} from '../tools/tools.js'

export const toDateObjects = (screenings) => {
    /* Converts api's dates as string ("2020-02-23T12:09:43Z") to JS Date object */
    screenings = screenings.map(screening => {
        screening = screening.replace('Z', '') // Dont't convert to local time
        return new Date(screening)
    })

    return screenings
}

export const checkIfOutdated = date => {
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    let now = new Date()
    now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    if (date < now) {
        return true
    } else{
        return false
    }
}

export const organizeScreenings = (screeningsArray) => {
    /* Changes array of dates to organised objects */
    screeningsArray = screeningsArray.sort((date1, date2) => {return date1.getTime() - date2.getTime()}) // set dates in ascending order
    let organized = {
        days: []
    }
    screeningsArray.map(screening => {

        if (checkIfOutdated(screening)) { // ignore outdated screenings
            return
        }

        const dd = screening.getDate()
        const mm = screening.getMonth() + 1
        const yyyy = screening.getFullYear()
        

        organized['days'].push(`${dd}.${mm}.${yyyy}`) // list of all dates

        const hour = screening.getHours()
        const minute = addZeroForBelowTen(screening.getMinutes())
        
        if (`${dd}.${mm}.${yyyy}` in organized){
            organized[`${dd}.${mm}.${yyyy}`].push(`${hour}:${minute}`)
        } else {
            organized[`${dd}.${mm}.${yyyy}`] = [`${hour}:${minute}`]
        }
    })
    organized['days'] = organized['days'].filter((a, b) => organized['days'].indexOf(a) === b) // remove duplicates

    return organized
}
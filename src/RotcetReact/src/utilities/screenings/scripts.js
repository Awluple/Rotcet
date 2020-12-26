import {addZeroForBelowTen} from '../tools/tools.js'

export const toDateObjects = (screenings) => {
    /* Converts api's dates as string ("2020-02-23T12:09:43Z") to JS Date object */
    screenings = screenings.map(screening => {
        const date = screening.date.replace('Z', '') // Dont't convert to local time
        return {
            id: screening.id,
            date: new Date(date)
        }
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
    screeningsArray = screeningsArray.sort((date1, date2) => {return date1.date.getTime() - date2.date.getTime()}) // set dates in ascending order
    let organized = {
        days: []
    }
    screeningsArray.map(screening => {

        if (checkIfOutdated(screening.date)) { // ignore outdated screenings
            return
        }
        const id = screening.id
        screening = screening.date

        const dd = addZeroForBelowTen(screening.getDate())
        const mm = addZeroForBelowTen(screening.getMonth() + 1)
        const yyyy = screening.getFullYear()
        

        organized['days'].push(`${dd}.${mm}.${yyyy}`) // list of all dates

        const hour = screening.getHours()
        const minute = addZeroForBelowTen(screening.getMinutes())
        
        if (`${dd}.${mm}.${yyyy}` in organized){
            organized[`${dd}.${mm}.${yyyy}`].push({
                id: id,
                hour: `${hour}:${minute}`,
            })
        } else {
            organized[`${dd}.${mm}.${yyyy}`] = [{
                id: id,
                hour: `${hour}:${minute}`,
            }]
        }
    })
    organized['days'] = organized['days'].filter((a, b) => organized['days'].indexOf(a) === b) // remove duplicates

    return organized
}
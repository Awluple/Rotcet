const drawSquare = (ctx, x, y, number, occupied, chosen) => {
    // colors for seats, red: occupied, orange: already selected by user, green: free
    const color = occupied.includes(number) ? 'red' : chosen.includes(number) ? 'orange' : 'green'
    const rect = {
        x: x,
        y: y,
        width: 25,
        height: 25,
        fill: color,
        number: number
    }
    // seat draw
    ctx.fillStyle=rect.fill
    ctx.strokeStyle=rect.stroke
    ctx.fillRect(rect.x,rect.y,rect.width,rect.height)

    // font settings and setting seat number on square
    ctx.textAlign="center" 
    ctx.textBaseline = "middle"
    ctx.fillStyle = "white"
    ctx.font="14px Arial"

    ctx.fillText(number, x+(rect.width/2), y+(rect.height/2))

    return rect
}


export const draw = (canvas, ctx, smallDevice, occupied, chosenSeats, addSeat, deleteSeat) => {
    // Draws cinema room

    let seats = [] // list of all seats with their position, number, dimensions and color
    let number = 108 // number of seats
    // draws seats
    for (let y = 35; y <= 315; y = y + 35) {
        for (let x = 95; x <= 485; x = x + 35) {
            seats.push(drawSquare(ctx, x, y, number, occupied, chosenSeats))
            number -= 1
        }
    }
    

    const handleClick = event => {
        // Checks if user clicked on a square, avaliable only for bigger devices

        // disable for small devices
        if (smallDevice || window.innerWidth <= 600) {
            return
        }
        const rect = event.target.getBoundingClientRect()

        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        // goes through all seats positions and checks if any was under users click
        // y: check if user clicked inside y axis of seat
        // x: check if user clicked inside x axis of seat
        // if seat exists add it to selected seats or delete it from
        for (const element of seats) {
            if (y > element.y && y < element.y + element.height 
                && x > element.x && x < element.x + element.width) {
                    if (!(occupied.includes(element.number) || chosenSeats.includes(element.number))) {
                        addSeat(element.number)
                        canvas.removeEventListener('click', handleClick)
                        break
                    } else if (chosenSeats.includes(element.number)){
                        deleteSeat(element.number)
                        canvas.removeEventListener('click', handleClick)
                        break
                    }
            }
        }
    
    }

    canvas.addEventListener('click', handleClick);

    // Draw stairs, screen, entrances

    // --- Stairs and screen ---

    ctx.fillStyle= 'grey'
    ctx.strokeStyle= 'white'
    ctx.save()

    // screen
    ctx.fillRect(150, 430, 300, 30)
    ctx.strokeRect(150, 430, 300, 30)

    // left stairs
    ctx.fillRect(20, 35, 50, 300)
    ctx.strokeRect(20, 35, 50, 300)

    // right stairs
    ctx.fillRect(530, 35, 50, 300)
    ctx.strokeRect(530, 35, 50, 300)

    // descriptions
    ctx.rotate(Math.PI/2)
    ctx.fillStyle= 'white'
    ctx.font="30px Arial"
    ctx.fillText('STAIRS', 180, -42)

    ctx.fillText('STAIRS', 180, -552)

    ctx.restore()

    ctx.font="15px Arial"
    ctx.fillStyle= 'white'
    ctx.fillText('SCREEN', 300, 442)

    // --- Entrances ---

    ctx.fillStyle= 'lightgrey'

    // left top
    ctx.moveTo(20, -5)
    ctx.lineTo(45, 25)
    ctx.lineTo(70, -5)
    ctx.lineTo(20, -5)
    ctx.fill()

    // right top
    ctx.moveTo(530, -5)
    ctx.lineTo(555, 25)
    ctx.lineTo(580, -5)
    ctx.lineTo(530, -5)
    ctx.fill()
    
    // left bottom
    ctx.moveTo(0, 360)
    ctx.lineTo(0, 400)
    ctx.lineTo(25, 380)
    ctx.lineTo(0, 360)
    ctx.fill()
}
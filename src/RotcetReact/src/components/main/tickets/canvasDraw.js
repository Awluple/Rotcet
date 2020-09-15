const drawSquare = (ctx, x, y, number, occupied) => {
    const color = occupied.includes(number) ? 'red' : 'green'
    console.log(y)
    const rect = {
        x: x,
        y: y,
        width: 25,
        height: 25,
        fill: color,
        number: number
    }
    ctx.fillStyle=rect.fill
    ctx.strokeStyle=rect.stroke
    ctx.fillRect(rect.x,rect.y,rect.width,rect.height)
    console.log(rect.x,rect.y,rect.width,rect.height)

    ctx.textAlign="center" 
    ctx.textBaseline = "middle"
    ctx.fillStyle = "white"
    ctx.font="14px Arial"


    ctx.fillText(number, x+(rect.width/2), y+(rect.height/2))
    return rect
}


const draw = (ctx, occupied) => {
    let seats = []
    let number = 108
    for (let y = 35; y <= 315; y = y + 35) {
        for (let x = 95; x <= 485; x = x + 35) {
            seats.push(drawSquare(ctx, x, y, number, occupied))
            number -= 1
        }
    }
    
    canvas.addEventListener('click', event => {
        const rect = event.target.getBoundingClientRect()

        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        

        // Collision detection between clicked offset and element.
        seats.forEach( element => {
            if (y > element.y && y < element.y + element.height 
                && x > element.x && x < element.x + element.width) {
                    if (!(occupied.includes(element.number))) {
                        alert(`clicked an element ${element.number}`);
                    }
            }
        });
    
    }, false);


   // --- Stairs and screen ---

    ctx.fillStyle= 'grey'
    ctx.strokeStyle= 'white'
    ctx.save()

    // screen
    ctx.beginPath();
    ctx.fillRect(150, 430, 300, 30)
    ctx.strokeRect(150, 430, 300, 30)

    // left stairs
    ctx.beginPath();
    ctx.fillRect(20, 35, 50, 300)
    ctx.strokeRect(20, 35, 50, 300)

    // right stairs
    ctx.beginPath();
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
    ctx.beginPath();
    ctx.moveTo(20, -5)
    ctx.lineTo(45, 25)
    ctx.lineTo(70, -5)
    ctx.lineTo(20, -5)
    ctx.fill()

    // right top
    ctx.beginPath();
    ctx.moveTo(530, -5)
    ctx.lineTo(555, 25)
    ctx.lineTo(580, -5)
    ctx.lineTo(530, -5)
    ctx.fill()
    
    // left bottom
    ctx.beginPath();
    ctx.moveTo(0, 360)
    ctx.lineTo(0, 400)
    ctx.lineTo(25, 380)
    ctx.lineTo(0, 360)
    ctx.fill()
}
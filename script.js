const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
// 1.1 Create a canvas context
const ctx = canvas.getContext("2d")

let score = 0;

//1.8 brick count
const brickRowCount = 9
const brickColumnCount = 5;

//1.2 Create a ball props
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
}

//1.4 Create a ball props
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0
}

//1.9 create bricks props
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
}

//2.0 create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo }
    }
}

// console.log(bricks)

//2.1 draw bricks on canvas 
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent'
            ctx.fill()
            ctx.closePath()
        })
    })
}

//1.3 draw a ball on canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2); // Outer circle
    ctx.fillStyle = '#0095dd'
    ctx.fill();
    ctx.closePath();
}

//1.5 draw a ball on canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h)
    ctx.fillStyle = '#0095dd'
    ctx.fill();
    ctx.closePath();
}

//2.3  move paddle on canvas
function movePaddle() {
    paddle.x += paddle.dx;

    //wall detection
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }
    if (paddle.x < 0) {
        paddle.x = 0;
    }
}

//2.7 Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy

    //2.8 wall collision (right /left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1
    }
    //2.8 wall collision (top /bottom)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1
    }

    //2.9 paddle collision 
    if (ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y) {
        ball.dy = -ball.speed
    }

    //3.1 bricks collision 
    bricks.forEach(column => {
        column.forEach( brick => {
            if(brick.visible) {
                if(ball.x - ball.size > brick.x && //left brick side check
                ball.x + ball.size <  brick.x + brick.w && //right brick side 
                ball.y + ball.size > brick.y && //top brick side check
                ball.y - ball.size < brick.y + brick.h //bottom brick side check
                ){
                    ball.dy *= -1 ;
                    brick.visible = false

                    //3.2 increase score
                    increaseScore()
                }
            }
        })
    })

    //3.5 Hit Bottom wall - lose
    if(ball.y + ball.size > canvas.height){
        showAllBricks()
        score = 0
    }
}

//3.3 increase score function
function increaseScore() {
    score++;

    if(score % (brickRowCount * brickRowCount) === 0) {
        showAllBricks()
    }
}

//3.4 Make a brick appear
function showAllBricks () {
    bricks.forEach(column => {
        column.forEach(brick => brick.visible = true)
    })
}

//1.6 draw everything 
function draw() {
    //2.7 clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawPaddle()
    drawBall()
    drawScore()
    drawBricks()
}

//1.7 draw score on canvas
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score : ${score}`, canvas.width - 100, 30);
}

// draw()

//2.2 update canvas draw
function update() {

    movePaddle()
    moveBall()

    draw()

    requestAnimationFrame(update)


}

update()

// 2.5 Keydown event
function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;


    } else if (e.key === 'left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed
    }
}

// 2.6 KeyUpn event
function keyUp(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'left' || e.key === 'ArrowLeft') {
        paddle.dx = 0
    }
}

//2.4 Keyboard event handlers
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)


//rules and close event handlers
rulesBtn.addEventListener('click', () => {
    rules.classList.add('show')
})

closeBtn.addEventListener('click', () => {
    rules.classList.remove('show')
})



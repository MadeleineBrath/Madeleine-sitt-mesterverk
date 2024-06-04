const canvas = document.getElementById("mini_game")
const ctx = canvas.getContext("2d")
canvas.width = 800
canvas.height = 500

const scoreElement = document.getElementById("score")
let score = 0
let gameOver = false
let gameStarted = false

const gameOverElement = document.getElementById("game-over")
const finalScoreElement = document.getElementById("final_score")
const buttonElement = document.getElementById("button")
const StartButton = document.getElementById("start-button")
const Div3 = document.querySelector(".div3")

function saveHighscore(score) {
    localStorage.setItem("highscore", score)
}

function getHighscore() {
    return localStorage.getItem("highscore") || 0
}

let highscore = getHighscore();
const highscoreElement = document.getElementById("highscore")
highscoreElement.innerHTML = highscore


class Player {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.x_speed = 0
        this.y_speed = 0
        this.friction = 0.5
        this.maxSpeed = 5
        this.active = true
        this.bullets = []
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    shoot() {
        let now = Date.now()
        if (shootPressed && now - lastShotTime > 300) {
            let bulletX = this.x + this.width / 2
            let bulletY = this.y
            this.bullets.push(new Bullet(bulletX, bulletY, 5, 10, "blue", -5))
            lastShotTime = now
        }
    }

    step() {
        // Standard bakkenivå
        let groundLevel = canvas.height - this.height
        let onGround = false

        // Sjekke kollisjon med borders
        for (let border of borders) {
            if (this.x < border.x + border.width &&
                this.x + this.width > border.x &&
                this.y + this.height <= border.y &&
                this.y + this.height + this.y_speed >= border.y) {
                groundLevel = border.y - this.height
                this.y = groundLevel
                this.y_speed = 0
                onGround = true
                break;
            }
        }

        if (this.y >= groundLevel) {
            this.y = groundLevel
            this.y_speed = 0
            onGround = true
        } else {
            this.y_speed += 1 // Gravitasjon
        }

        if (upKey && onGround) {
            this.y_speed -= 13 // Hopp
        }

        if (this.active) {
            if (!leftKey && !rightKey || leftKey && rightKey) {
                this.x_speed *= this.friction;
            } else if (rightKey) {
                this.x_speed++
            } else if (leftKey) {
                this.x_speed--
            }
        }

        if (this.x_speed > this.maxSpeed) {
            this.x_speed = this.maxSpeed
        } else if (this.x_speed < -this.maxSpeed) {
            this.x_speed = -this.maxSpeed
        }

        this.x += this.x_speed
        this.y += this.y_speed

        // Begrens spilleren til canvas-grensene (sidene)
        if (this.x < 0) {
            this.x = 0
            this.x_speed = 0
        } else if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width
            this.x_speed = 0
        }

        this.bullets.forEach(bullet => bullet.step())

        if (this.y < highestPosition) {
            score += 1
            highestPosition = this.y
            scoreElement.innerHTML = score
        }
    }
}

class Bullet {
    constructor(x, y, width, height, color, speed) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.speed = speed
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    step() {
        this.y += this.speed
    }
}

class Enemy {
    constructor(x, y, width, height, color, speed) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.speed = speed
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    step() {
        this.y += this.speed
    }
}

let player = new Player(20, 430, 30, 70, "pink")
let highestPosition = player.y
let lastShotTime = 0

let upKey = false
let rightKey = false
let leftKey = false
let shootPressed = false

// Bevege "Player" ved å enten trykke på piltastene eller bokstaver:
function setUpInputs() {
    document.addEventListener("keydown", function (event) {
        if (event.key === "w" || event.key === "ArrowUp") {
            upKey = true
        } else if (event.key === "a" || event.key === "ArrowLeft") {
            leftKey = true
        } else if (event.key === "d" || event.key === "ArrowRight") {
            rightKey = true
        } else if (event.key === " ") {
            shootPressed = true
        }
    });

    document.addEventListener("keyup", function (event) {
        if (event.key === "w" || event.key === "ArrowUp") {
            upKey = false
        } else if (event.key === "a" || event.key === "ArrowLeft") {
            leftKey = false
        } else if (event.key === "d" || event.key === "ArrowRight") {
            rightKey = false
        } else if (event.key === " ") {
            shootPressed = false
        }
    });
}

let cameraOffsetY = 0

function updateCamera() {
    if (player.y < canvas.height / 2 - player.height / 2) {
        cameraOffsetY = canvas.height / 2 - player.y - player.height / 2
    } else {
        cameraOffsetY = 0
    }
}

// Lage objekter som "player" kan hoppe på
let borders = []

class Border {
    constructor(x, y, width, height, type) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.type = type
    }

    draw() {
        if (this.type === 1) {
            ctx.fillStyle = "green"
        } else if (this.type === 2) {
            ctx.fillStyle = "red"
        }
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

}

function createBorders() {
    borders = []
    let spacing = 180
    for (let i = 0; i < 100; i++) {
        let y = 450 - i * spacing;
        borders.push(new Border(60, 450 - i * 130, 100, 10, 1))
        borders.push(new Border(190, 400 - i * 140, 75, 10, 2))
        borders.push(new Border(300, 430 - i * 120, 75, 10, 1))
        borders.push(new Border(410, 500 - i * 110, 75, 10, 2))
        borders.push(new Border(520, 450 - i * 130, 80, 10, 1))
        borders.push(new Border(650, 500 - i * 120, 80, 10, 2))
    }
}

createBorders()

let enemies = []
let enemyproduksjonHeight = -100

function produksjonEnemy() {
    if (!gameStarted) return
    let x = Math.random() * (canvas.width - 30)
    let y = enemyproduksjonHeight
    enemyproduksjonHeight -= 200
    let speed = 2 + Math.random() * 2;
    enemies.push(new Enemy(x, y, 30, 30, "red", speed))
}

function checkCollision() {
    for (let enemy of enemies) {
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            return true;
        }
    }
    return false
}

// Henter opp start-verdier til spillet når man trykker på knappen
buttonElement.addEventListener("click", () => {
    player = new Player(20, 430, 30, 70, "pink")
    enemies = []
    createBorders()
    score = 0
    scoreElement.innerHTML = score
    gameOver = false
    gameOverElement.style.display = "none"
    enemyproduksjonHeight = -100
    highestPosition = player.y
    lastShotTime = 0
})

StartButton.addEventListener("click", () => {
    player = new Player(20, 430, 30, 70, "pink")
    enemies = []
    createBorders()
    score = 0
    scoreElement.innerHTML = score
    gameOver = false
    Div3.style.display = "none"
    enemyproduksjonHeight = -100
    highestPosition = player.y
    gameStarted = true
    lastShotTime = 0
})




// Gameloop
function gameloop() {
    if (gameOver) return

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.step()
    player.shoot()
    updateCamera()
    ctx.save()
    ctx.translate(0, cameraOffsetY)
    for (let border of borders) {
        border.draw()
    }
    for (let enemy of enemies) {
        enemy.step()
        enemy.draw()
    }

    player.bullets.forEach(bullet => bullet.draw())
    player.draw()
    ctx.restore()

    player.bullets.forEach(bullet => bullet.draw())

    // Kollisjon mellom bullets og enemies
    for (let bullet of player.bullets) {
        for (let enemy of enemies) {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                player.bullets = player.bullets.filter(b => b !== bullet)
                enemies = enemies.filter(e => e !== enemy)
                score += 20
                scoreElement.innerHTML = score
                break;
            }
        }
    }

    // Kollisjon mellom spilleren og enemies
    if (checkCollision()) {
        gameOver = true
        finalScoreElement.innerHTML = score
        gameOverElement.style.display = "block"
    }

    if (score > highscore) {
        highscore = score
        saveHighscore(highscore)
        highscoreElement.innerHTML = highscore
    }
}

setInterval(gameloop, 1000 / 60)

setInterval(produksjonEnemy, 10)

setUpInputs()

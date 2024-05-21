const canvas = document.getElementById("mini_game");
const ctx = canvas.getContext("2d");
canvas.width = 950;
canvas.height = 600;

let upKey;
let rightKey;
let downKey;
let leftKey;

const groundLevel = 600;

let borders = [];

setUpInputs();

let gameLoop = setInterval(step, 1000 / 30);

function step() {
    player.step();
    draw();
}

function draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1000, 700);
    player.draw();

    for (let i = 0; i < borders.length; i++) {
        borders[i].draw();
    }
}

function setUpInputs() {
    document.addEventListener("keydown", function (event) {
        if (event.key === "w" || event.key === "ArrowUp") {
            upKey = true;
        } else if (event.key === "a" || event.key === "ArrowLeft") {
            leftKey = true;
        } else if (event.key === "s" || event.key === "ArrowDown") {
            downKey = true;
        } else if (event.key === "d" || event.key === "ArrowRight") {
            rightKey = true;
        }
    });

    document.addEventListener("keyup", function (event) {
        if (event.key === "w" || event.key === "ArrowUp") {
            upKey = false;
        } else if (event.key === "a" || event.key === "ArrowLeft") {
            leftKey = false;
        } else if (event.key === "s" || event.key === "ArrowDown") {
            downKey = false;
        } else if (event.key === "d" || event.key === "ArrowRight") {
            rightKey = false;
        }
    });
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.x_speed = 0;
        this.y_speed = 0;
        this.friction = 0.6;
        this.maxSpeed = 10;
        this.width = 50;
        this.height = 100;
        this.active = true;
    }

    step() {

    let groundLevel = 450;
    

    function changeGroundLevel(newLevel) {
        groundLevel = newLevel;
    if (newLevel != groundlevel){
        
    }
    }

    // Bakkenivå
    if(this.y >= groundLevel) {
        this.y = groundLevel;
    }
    


        if (this.active) {
            if (!leftKey && !rightKey || leftKey && rightKey) {
                this.x_speed *= this.friction;
            } else if (rightKey) {
                this.x_speed++;
            } else if (leftKey) {
                this.x_speed--;
            }
        }

        // Bevelegse oppover
        if (upKey) {
            this.y_speed -= 15;
        }

        // Gravitasjon
        this.y_speed += 9.8;


        //Korrigere farten
        if (this.x_speed > this.maxSpeed) {
            this.x_speed = this.maxSpeed;
        } else if (this.x_speed < -this.maxSpeed) {
            this.x_speed = -this.maxSpeed;
        }
        if (this.y_speed > this.maxSpeed) {
            this.y_speed = this.maxSpeed;
        } else if (this.y_speed < -this.maxSpeed) {
            this.y_speed = -this.maxSpeed;
        }

        this.x += this.x_speed;
        this.y += this.y_speed;
    }

    draw() {
        ctx.fillStyle = "pink";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}

let player = new Player(100, 400);


class Border {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }

    draw() {
        if (this.type === 1) {
            ctx.fillStyle = "green";
        } else if (this.type === 2) {
            ctx.fillStyle = "red";
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

for (let i = 0; i < 6; i++) {
    borders.push(new Border(0 + 100 * i, 550, 100, 100, 1));
}
borders.push(new Border(0, 500, 100, 100, 2))
for (let i = 0; i > 3; i++) {
    borders.push(new Border(600, 420 * i, 100, 100, 2));
}





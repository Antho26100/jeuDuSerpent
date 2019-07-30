window.onload = () => {
    
    class Game {

        constructor(canvasWidth = 900, canvasHeight = 600){
            this.canvas = document.createElement('canvas');
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.blockSize = 30;
            this.ctx = this.canvas.getContext('2d');
            this.widthInBlocks = this.canvasWidth/this.blockSize;
            this.heightInBlocks = this.canvasHeight/this.blockSize;
            this.centreX = this.canvasWidth / 2;
            this.centreY = this.canvasHeight / 2;
            this.delay = 100;
            this.kaa;
            this.api;
            this.score;
            this.timeout;
        }
        
        init() {
            this.canvas.width = this.canvasWidth;
            this.canvas.height = this.canvasHeight;
            this.canvas.style.border = "30px solid gray";
            this.canvas.style.margin = "50px auto";
            this.canvas.style.display = "block";
            this.canvas.style.backgroundColor = "#ddd";
            document.body.appendChild(this.canvas); 
            this.launch();
        }
    
        launch() {
            this.kaa = new Snake ( "right",[6,4],[5,4],[4,4]);
            this.api = new Apple();
            this.score = 0;
            clearTimeout(this.timeout);
            this.delay = 100;
            this.refreshCanvas();
        }
    
        refreshCanvas() {
    
            this.kaa.advance();
            if(this.kaa.checkCollision(this.widthInBlocks, this.heightInBlocks)){
                Drawing.gameOver(this.ctx, this.centreX,this.centreY);//méthode static de la classe drawing
            } else {    
                if(this.kaa.isEatingApple(this.api)){
                    this.kaa.ateApple = true;
                    this.score ++;
                    do{
                        this.api.setNewPosition(this.widthInBlocks, this.heightInBlocks);
                    }
                    while(this.api.isOnSnake(this.kaa));
    
                    if(this.score % 5 == 0){
                        this.speedUp();
                    }
                }
                this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
                Drawing.drawScore(this.ctx, this.centreX, this.centreY, this.score);
                Drawing.drawSnake(this.ctx, this.blockSize, this.kaa);
                Drawing.drawApple(this.ctx, this.blockSize, this.api);
                this.timeout = setTimeout(this.refreshCanvas.bind(this),this.delay);// on relie le this avec le mot clef bind sinon serait éxecuté dans le contexte global
            }      
        }
    
        speedUp() {
            this.delay/=2;
        }
    }

    class Snake {
   
        constructor(direction, ...body){
            this.body = body;
            this.direction = direction;
            this.ateApple = false;
        }

        advance() {
            const nextPosition = this.body[0].slice();
            switch(this.direction){ 
                case "left": nextPosition[0] -= 1;
                    break;
                case "right": nextPosition[0] += 1;
                    break;
                case "down": nextPosition[1] += 1;
                    break;
                case "up": nextPosition[1] -= 1;
                    break;
                default: throw("invalid Direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple){
                this.body.pop();
            } else { 
                this.ateApple = false;
            }
        };

        setDirection(newDirection){
            let allowedDirection; 
            switch(this.direction){
                case "left": 
                case "right": 
                    allowedDirection = ["up","down"];
                    break;
                case "down":
                case "up": 
                    allowedDirection = ["right","left"];
                    break;
                default: throw("invalid Direction");
            }
            if(allowedDirection.indexOf(newDirection) > -1){ 
                this.direction = newDirection;               
            }

        };

        checkCollision(widthInBlocks, heightInBlocks) {
            let wallCollision = false;
            let snakeCollision = false;
            const [head,...rest] = this.body;
            const [headX,headY] = head;
            const maxX = widthInBlocks - 1; 
            const minX = 0; 
            const maxY = heightInBlocks - 1; 
            const minY = 0;
            const isNotBetweenHorizontalWall = headX < minX || headX > maxX; 
            const isNotBetweenVerticalWall = headY < minY || headY > maxY; 

            if(isNotBetweenHorizontalWall || isNotBetweenVerticalWall){
                    wallCollision = true;
            }  
            for(let block of rest){ 
                if(headX === block[0] && headY === block[1]){
                        snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };

        isEatingApple(appleToEat) {
            let head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else 
                return false;
        };
    }

    class Apple { 

        constructor(position = [10,10]){
            this.position = position;
        }
        
        setNewPosition(widthInBlocks, heightInBlocks) {
            const newX = Math.round(Math.random() * (widthInBlocks -1));
            const newY = Math.round(Math.random() * (heightInBlocks -1));
            this.position = [newX,newY];
        }

        isOnSnake(snakeTocheck){
            let isOnSnake = false;
            for(let block of snakeTocheck.body){
                if(this.position[0] === block[0] && this.position[1] === block[1] ){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }

    }

    class Drawing { // class regroupant toutes les méthodes liées au dessin
        //création de méthodes static afin d'éviter d'instancier un objet
        static gameOver(ctx, centreX, centreY) {
            ctx.save();
            ctx.font = "bold 80px sans-serif";
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeStyle = "white";
            ctx.strokeText("Game Over",centreX,centreY - 180);
            ctx.fillText("Game Over",centreX,centreY - 180);
            ctx.font = "bold 35px sans-serif";
            ctx.strokeText("Appuyer sur espace pour rejouer",centreX,centreY + 180);
            ctx.fillText("Appuyer sur espace pour rejouer",centreX,centreY + 180);
            ctx.restore();
        }

        static drawScore(ctx, centreX, centreY, score) {
            ctx.save();
            ctx.font = "bold 200px sans-serif";
            ctx.fillStyle = "gray";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(score.toString(), centreX, centreY);
            ctx.restore();
        }

        static drawBlock(ctx, position, blockSize) {                                      
            const[x,y] = position;//destructuring de Array
            ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }        
        
        static drawSnake(ctx, blockSize, snake) { 
            ctx.save(); 
            ctx.fillStyle = "#ff0000";
            for(let block of snake.body){ 
                this.drawBlock(ctx, block, blockSize);
            }
            ctx.restore();    
        }

        static drawApple(ctx, blockSize, apple) { 
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "#33cc33";
            const radius = blockSize/2; 
            const x = apple.position[0] * blockSize + radius;
            const y = apple.position[1] * blockSize + radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        }
    }
    
    let myGame = new Game();
    myGame.init();

    document.onkeydown = (e) => { 
        
        const key = e.keyCode;
        let newDirection;
        switch(key){
            case 37: newDirection = "left";
                break;
            case 38 : newDirection = "up";
                break;
            case 39 : newDirection = "right";
                break;
            case 40 : newDirection = "down";
                break;
            case 32 : myGame.launch();
                     return;  
            default: return;
        }
        myGame.kaa.setDirection(newDirection);
    }

    
}







    
    



window.onload = () => {
    
    const canvas = document.createElement('canvas');
    const canvasWidth = 900;
    const canvasHeight = 600;
    const blockSize = 30;
    const ctx = canvas.getContext('2d');
    const widthInBlocks = canvasWidth/blockSize;
    const heightInBlocks = canvasHeight/blockSize;
    const centreX = canvasWidth / 2;
    const centreY = canvasHeight / 2;
    let delay = 100;
    let kaa;
    let api;
    let score;
    let timeout;

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

        checkCollision() {
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
        
        setNewPosition() {
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
    
    const init = () => {
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas); 
        launch();
    }

    const launch = () => {
        kaa = new Snake ( "right",[6,4],[5,4],[4,4]);
        api = new Apple();
        score = 0;
        clearTimeout(timeout);
        delay = 100;
        refreshCanvas();
    }

    const refreshCanvas = () => {

        kaa.advance();
        if(kaa.checkCollision()){
            Drawing.gameOver(ctx, centreX,centreY);//méthode static de la classe drawing
        } else {

            if(kaa.isEatingApple(api)){
                kaa.ateApple = true;
                score ++;
                do{
                    api.setNewPosition();
                }
                while(api.isOnSnake(kaa));

                if(score % 5 == 0){
                    speedUp();
                }
            }
            ctx.clearRect(0,0,canvas.width, canvas.height);
            Drawing.drawScore(ctx, centreX, centreY, score);
            Drawing.drawSnake(ctx, blockSize, kaa);
            Drawing.drawApple(ctx, blockSize, api);
            timeout = setTimeout(refreshCanvas,delay);
        }
        
    }

    const speedUp = () => {
        delay/=2;
    }

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
            case 32 : launch();
                     return;  
            default: return;
        }
        kaa.setDirection(newDirection);
    }

    init();
}







    
    



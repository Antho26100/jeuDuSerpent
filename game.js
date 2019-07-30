import Snake from "./snake.js";
import Apple from "./apple.js";
import Drawing from "./drawing.js";

export default class Game {

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
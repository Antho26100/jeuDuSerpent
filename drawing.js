export default class Drawing { // class regroupant toutes les méthodes liées au dessin
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
export default class Snake {
   
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
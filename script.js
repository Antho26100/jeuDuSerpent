window.onload = function() {
    
    const canvasWidth = 900;
    const canvasHeight = 600;
    const blockSize = 30;
    const canvas = document.createElement('canvas');
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

    init();

    function init() {
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);//accroche le canvas au document  
        kaa = new Snake ([[6,4],[5,4],[4,4]], "right");//instance de Snack avec en paramètre le corps du serpent
        api = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }

    function refreshCanvas() {

        kaa.advance();//fait avancer notre serpent, méthode du serpent
        if(kaa.checkCollision()){
            gameOver();
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
            ctx.clearRect(0,0,canvas.width, canvas.height);//suppression du contexte
            drawScore();
            kaa.draw();//appel la méthode draw de l'objet kaa instancier de Snake
            api.draw();
            timeout = setTimeout(refreshCanvas,delay);// fonction répétant refreshCanvas suivant la valeur delay
        }
        
    }

    function speedUp() {
        delay/=2;
    }

    function drawBlock(ctx, position) { 
                                      
        const x = position[0] * blockSize;
        const y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }                                             

    function gameOver(){
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

    function restart() {
        kaa = new Snake ([[6,4],[5,4],[4,4]], "right");
        api = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        delay = 100;
        refreshCanvas();
    }

    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }
    
    function Snake(body, direction){

        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function() { 
            ctx.save(); 
            ctx.fillStyle = "#ff0000";
            for(let i = 0; i < this.body.length; i ++){ 
                drawBlock(ctx,this.body[i])
            }
            ctx.restore();    
        }

        this.advance = function () {
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
            this.body.unshift(nextPosition);//on rajoute la valeur de nextPosition avec la méthode unshift ([[7,4],[6,4],[5,4],[4,4]])
            if(!this.ateApple){
                this.body.pop();//supprime le dernier élèment de notre tableau
            } else { //ce else évite de pop la tableau, agrandissant donc le serpent
                this.ateApple = false;
            }
        };

        this.setDirection = function (newDirection){// va permettre de régler une direction
            let allowedDirection; //va stocker un tableau de directions autorisées à 2 index
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
            if(allowedDirection.indexOf(newDirection) > -1){ // la méthode indexOf premet de vérifier si une valeur est contenu dans un tableau, si elle ne l'est pas...
                this.direction = newDirection;               // ...la valuer retourné est -1 et nous ne rentrerons pas dans la condition
            }

        }

        this.checkCollision = function() {//méthode permettant de savoir si il y a une collision
            let wallCollision = false;
            let snakeCollision = false;
            const head = this.body[0];
            const rest = this.body.slice(1);
            const headX = head[0];
            const headY = head[1];
            const maxX = widthInBlocks - 1; //permet de définir un bloc maximum sur l'axe des abscisses
            const minX = 0; // permet de définir un bloc minimum sur l'axe des abscisses
            const maxY = heightInBlocks - 1; // idem pour les ordonnées
            const minY = 0;
            const isNotBetweenHorizontalWall = headX < minX || headX > maxX; //stocke dans cette variable la condition dans laquelle le serpent n'est pas entre les murs horizontaux
            const isNotBetweenVerticalWall = headY < minY || headY > maxY; // pour les murs verticaux

            if(isNotBetweenHorizontalWall || isNotBetweenVerticalWall){
                    wallCollision = true;
            }  
            for(let i = 0; i < rest.length; i++){ //parcours du tableau rest correspondant au corps du serpent
                if(headX === rest[i][0] && headY === rest[i][1]){ //si les pts x et y de notre serpent correspondent à ceux d'un des blocs du serpent, il y a snakeCollision
                        snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        }
        this.isEatingApple = function(appleToEat) {//permet de savoir si le serpent à manger la pomme
            let head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else 
                return false;
        }
    }

    function Apple (position){ // fonction constructeur de pomme, prend en paramètre une position sous frome de tableau
        this.position = position;
        this.draw = function() { 
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "#33cc33";
            const radius = blockSize/2; //taille du rayon, soit la moitié d'un block
            const x = this.position[0] * blockSize + radius;//on rajoute radius qui correspond à la moitié d'un bloc afin de se trouver au centre d'un bloc
            const y = this.position[1] * blockSize + radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);//méthode afin de créer un cercle
            ctx.fill();
            ctx.restore();
        }
        this.setNewPosition = function() {// permet de paramètrer une nouvelle position à la pomme
            const newX = Math.round(Math.random() * (widthInBlocks -1));
            const newY = Math.round(Math.random() * (heightInBlocks -1));
            this.position = [newX,newY];//tableau contenant la nouvelle position de la pomme
        }
        this.isOnSnake = function (snakeTocheck) {//vérifie que la pomme ne se créer par sur le serpent
            let isOnSnake = false;
            for(let i = 0; i < snakeTocheck.body.length; i++){
                if(this.position[0] === snakeTocheck.body[i][0] && this.position[1] === snakeTocheck.body[i][1] ){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }

    }

    document.onkeydown = function handleKeyDown(e) { //permet de récupérer un évènement clavier, ici quand l'utilisateur enfonce une touche, capturer dans "e"
        
        const key = e.keyCode;//on récupère le code de cette touche dans la variable key
        let newDirection;//stockera la nouvelle direction
        switch(key){//test les différents cas et stock dans la variable newDirection
            case 37: newDirection = "left";
                break;
            case 38 : newDirection = "up";
                break;
            case 39 : newDirection = "right";
                break;
            case 40 : newDirection = "down";
                break;
            case 32 : restart();
                     return;  
            default: return;
        }
        kaa.setDirection(newDirection);//appel de la fonction setDirection de l'objet kaa
    }




}


    
    



window.onload = function() {
    //Nous utilisons ici var qui sera changé à la phase de refactoringq
    var canvasWidth = 900;
    var canvasHeight = 600;
    var canvas;
    var blockSize = 30;//sera la taille d'un block pour notre serpent
    var ctx;//a pour valeur le contexte
    var delay = 100;//va permettre de fixer un temps de rafraîchissement
    var kaa;//objet, instance de Snake
    var api;
    var widthInBlocks = canvasWidth/blockSize;//permet d'avoir la largeur en block
    var heightInBlocks = canvasHeight/blockSize;//idem pour la hauteur
    var score = 0;

    init();

    function init() {
        
        canvas = document.createElement('canvas');//création de l'élèment canvas
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);//accroche le canvas au document  
        ctx = canvas.getContext('2d');//notre canvas doit posséder un contexte, ici en 2d
        kaa = new Snake ([[6,4],[5,4],[4,4]], "right");//instance de Snack avec en paramètre le corps du serpent
        api = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }

    function refreshCanvas() {

        kaa.advance();//fait avancer notre serpent, méthode du serpent
        if(kaa.checkCollision()){
            gameOver();
        }
        else{

            if(kaa.isEatingApple(api)){
                kaa.ateApple = true;
                score ++;
                do{
                    api.setNewPosition();
                }
                while(api.isOnSnake(kaa))
            }
            ctx.clearRect(0,0,canvas.width, canvas.height);//suppression du contexte
            kaa.draw();//appel la méthode draw de l'objet kaa instancier de Snake
            api.draw();
            drawScore();
            setTimeout(refreshCanvas,delay);// fonction répétant refreshCanvas suivant la valeur delay
        }
        
    }

    function drawBlock(ctx, position) {//dessine un bloc, prend en argument le contexte et un tableau à 2 index... 
                                      //..qui correspond à un bloc du serpent
        var x = position[0] * blockSize;//multiplie la position à l'index 0 par la taille d'un bloc fixé à 30
        var y = position[1] * blockSize;//multiplie la position à l'index 1 par la taille d'un bloc fixé à 30
        ctx.fillRect(x, y, blockSize, blockSize);//on dessine ds le contexte un carré à la position x et y et de taille 30sur30
    }                                              //la succession de nos 3 carrés formeront un rectangle correspondant à notre serpent

    function gameOver(){//affiche le Game Over
        ctx.save();
        ctx.fillText("Game Over",5,15);
        ctx.fillText("Appuyer sur espace pour rejouer",5,30);
        ctx.restore();
    }

    function restart() {//permet de recommencer une partie
        kaa = new Snake ([[6,4],[5,4],[4,4]], "right");
        api = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }

    function drawScore(){//dessine le score
        ctx.save();
        ctx.fillText(score.toString(),5,canvasHeight - 5);
        ctx.restore();
    }
    

    //fonction constructeur qui permet d'instancier un objet serpent, prend 1 paramètre qui est le corps du serpent[un tableau]
    function Snake(body, direction){

        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function() { // fonction draw permettant de dessiner les blocs constituant le serpent
            ctx.save(); //sauvegarde le contexte
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length; i ++){ // nous bouclons sur le corps du serpent afin d'en créer les blocs
                drawBlock(ctx,this.body[i])//appel à la fonction drawBlock sur chaque index du tableau this.body
            }
            ctx.restore(); //restaure le contexte précédent   
        }

        this.advance = function () {//fonction permettant de faire avancer le serpent, sera appelé dans la fonction refreshCanvas

            var nextPosition = this.body[0].slice();//on fait une copie de l'index 0 ac la méthode slice stocké dans nextPosition([6,4])
            switch(this.direction){ // va nous permettre de tester le contenu de la variable direction
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
            var allowedDirection; //va stocker un tableau de directions autorisées à 2 index
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
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var headX = head[0];
            var headY = head[1];
            var maxX = widthInBlocks - 1; //permet de définir un bloc maximum sur l'axe des abscisses
            var minX = 0; // permet de définir un bloc minimum sur l'axe des abscisses
            var maxY = heightInBlocks - 1; // idem pour les ordonnées
            var minY = 0;
            var isNotBetweenHorizontalWall = headX < minX || headX > maxX; //stocke dans cette variable la condition dans laquelle le serpent n'est pas entre les murs horizontaux
            var isNotBetweenVerticalWall = headY < minY || headY > maxY; // pour les murs verticaux

            if(isNotBetweenHorizontalWall || isNotBetweenVerticalWall){
                    wallCollision = true;
            }  
            for(var i = 0; i < rest.length; i++){ //parcours du tableau rest correspondant au corps du serpent
                if(headX === rest[i][0] && headY === rest[i][1]){ //si les pts x et y de notre serpent correspondent à ceux d'un des blocs du serpent, il y a snakeCollision
                        snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        }
        this.isEatingApple = function(appleToEat) {//permet de savoir si le serpent à manger la pomme
            var head = this.body[0];
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
            var radius = blockSize/2; //taille du rayon, soit la moitié d'un block
            var x = this.position[0] * blockSize + radius;//on rajoute radius qui correspond à la moitié d'un bloc afin de se trouver au centre d'un bloc
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);//méthode afin de créer un cercle
            ctx.fill();
            ctx.restore();
        }
        this.setNewPosition = function() {// permet de paramètrer une nouvelle position à la pomme
            var newX = Math.round(Math.random() * (widthInBlocks -1));
            var newY = Math.round(Math.random() * (heightInBlocks -1));
            this.position = [newX,newY];//tableau contenant la nouvelle position de la pomme
        }
        this.isOnSnake = function (snakeTocheck) {//vérifie que la pomme ne se créer par sur le serpent
            var isOnSnake = false;
            for(var i = 0; i < snakeTocheck.body.length; i++){
                if(this.position[0] === snakeTocheck.body[i][0] && this.position[1] === snakeTocheck.body[i][1] ){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }

    }

    document.onkeydown = function handleKeyDown(e) { //permet de récupérer un évènement clavier, ici quand l'utilisateur enfonce une touche, capturer dans "e"
        
        var key = e.keyCode;//on récupère le code de cette touche dans la variable key
        var newDirection;//stockera la nouvelle direction
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


    
    



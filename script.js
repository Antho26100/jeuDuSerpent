window.onload = function() {
    //Nous utilisons ici var qui sera changé à la phase de refactoringq
    var canvasWidth = 900;
    var canvasHeight = 600;
    var canvas;
    var blockSize = 30;//sera la taille d'un block pour notre serpent
    var ctx;//a pour valeur le contexte
    var delay = 100;//va permettre de fixer un temps de rafraîchissement
    var kaa;//objet, instance de Snake
    var api;//objet, instance de Apple
    var widthInBlocks = canvasWidth/blockSize;//permet de définir le contour du canvas en bloc
    var heightInBlocks = canvasHeight/blockSize;



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
        refreshCanvas();
    }

    function refreshCanvas() {

        kaa.advance();//fait avancer notre serpent, méthode du serpent
        if(kaa.checkCollision()){

        } 
        else{
            ctx.clearRect(0,0,canvas.width, canvas.height);//suppression du contexte
            kaa.draw();//appel la méthode draw de l'objet kaa instancier de Snake
            api.draw();
            setTimeout(refreshCanvas,delay);// fonction répétant refreshCanvas suivant la valeur delay
        } 
        
    }

    function drawBlock(ctx, position) {//dessine un bloc, prend en argument le contexte et un tableau à 2 index... 
                                      //..qui correspond à un bloc du serpent
        var x = position[0] * blockSize;//multiplie la position à l'index 0 par la taille d'un bloc fixé à 30
        var y = position[1] * blockSize;//multiplie la position à l'index 1 par la taille d'un bloc fixé à 30
        ctx.fillRect(x, y, blockSize, blockSize);//on dessine ds le contexte un carré à la position x et y et de taille 30sur30
    }                                              //la succession de nos 3 carrés formeront un rectangle correspondant à notre serpent
    

    //fonction constructeur qui permet d'instancier un objet serpent, prend 1 paramètre qui est le corps du serpent[un tableau]
    function Snake(body, direction){

        this.body = body;
        this.direction = direction;
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
            this.body.pop();//supprime le dernier élèment de notre tableau
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

        this.checkCollision = function() {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var headX = head[0];
            var headY = head[1];
            var maxX = widthInBlocks;
            var minX = -1;
            var maxY = heightInBlocks;
            var minY = -1;

            if(headX === maxX || headX === minX || headY === maxY || headY === minY){
                    wallCollision = true;
            } else {
                for(var i = 0; i < rest.length; i++){
                    if(headX === rest[i][0] && headY === rest[i][1]){
                        snakeCollision = true;
                    }
                }
            }
            return wallCollision || snakeCollision;
        }
    }

    function Apple (position){ // fonction constructeur de pomme, prend en paramètre une position sous frome de tableau
        this.position = position;
        this.draw = function() { 
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "#33cc33";
            var radius = blockSize/2; //taille du rayon, soit la moitié d'un block
            var x = position[0] * blockSize - radius;
            var y = position[1] * blockSize - radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);//méthode afin de créer un cercle
            ctx.fill();
            ctx.restore();

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
            default: return;
        }
        kaa.setDirection(newDirection);//appel de la fonction setDirection de l'objet kaa
    }




}


    
    



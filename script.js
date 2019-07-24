window.onload = function() {
    //Nous utilisons ici var qui sera changé à la phase de refactoringq
    var canvasWidth = 900;
    var canvasHeight = 600;
    var canvas;
    var blockSize = 30;//sera la taille d'un block pour notre serpent
    var ctx;//a pour valeur le contexte
    var delay = 1000;//va permettre de fixer un temps de rafraîchissement
    var kaa;//objet, instance de Snake

    init();

    function init() {
        
        canvas = document.createElement('canvas');//création de l'élèment canvas
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);//accroche le canvas au document  
        ctx = canvas.getContext('2d');//notre canvas doit posséder un contexte, ici en 2d
        kaa = new Snake ([[6,4],[5,4],[4,4]]);//instance de Snack avec en paramètre le corps du serpent
        refreshCanvas();
    }

    function refreshCanvas() {

        ctx.clearRect(0,0,canvas.width, canvas.height);//suppression du contexte
        kaa.draw();//appel la méthode draw de l'objet kaa instancier de Snake)
        setTimeout(refreshCanvas,delay);// fonction répétant refreshCanvas suivant la valeur delay
    }

    function drawBlock(ctx, position) {//dessine un bloc, prend en argument le contexte et un tableau à 2 index... 
                                      //..qui correspond à un bloc du serpent
        var x = position[0] * blockSize;//multiplie la position à l'index 0 par la taille d'un bloc fixé à 30
        var y = position[1] * blockSize;//multiplie la position à l'index 1 par la taille d'un bloc fixé à 30
        ctx.fillRect(x, y, blockSize, blockSize);//on dessine ds le contexte un carré à la position x et y et de taille 30sur30
    }                                              //la succession de nos 3 carrés formeront un rectangle correspondant à notre serpent
    

    //fonction constructeur qui permet d'instancier un objet serpent, prend 1 paramètre qui est le corps du serpent[un tableau]
    function Snake(body){

        this.body = body;
        this.draw = function() { // fonction draw permettant de dessiner les blocs constituant le serpent
            ctx.save(); //sauvegarde le contexte
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length; i ++){ // nous bouclons sur le corps du serpent afin d'en créer les blocs
                drawBlock(ctx,this.body[i])//appel à la fonction drawBlock sur chaque index du tableau this.body
            }
            ctx.restore(); //restaure le contexte précédent   
        }
    }
}


    
    



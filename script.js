window.onload = function() {
    //Nous utilisons ici var qui sera changé à la phase de refactoring
    var canvas = document.createElement('canvas');//création de l'élèment canvas
    canvas.width = 900;
    canvas.height = 600;
    canvas.style.border = "1px solid";
    document.body.appendChild(canvas);//accroche le canvas au document

    var ctx = canvas.getContext('2d');//notre canvas doit posséder un contexte, ici en 2d
    ctx.fillStyle = "#ff0000";// couleur utilisé à l'intérieur des formes
    ctx.fillRect(30,30,100,50); // création d'un rectangle(x,y,largeur,hauteur)


}


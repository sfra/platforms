define(['helpers', 'Ui','RectangleDecorator','SpriteDecorator'], function(helpers, Ui,RectangleDecorator,SpriteDecorator) {


    var cnv = document.getElementById("cnv");
    var canvasWidth = window.getComputedStyle(cnv).getPropertyValue('width');
    var canvasHeight = window.getComputedStyle(cnv).getPropertyValue('height');

    Ui.context = cnv.getContext("2d");

    Ui.context.__proto__.cls = function() {
        this.clearRect(0, 0, parseInt(canvasWidth, 10), parseInt(canvasHeight, 10));
    };

    Ui.context.fillStyle = "#334455";

    var wallpaper = new Image();
    wallpaper.src = 'media/images/sprites/wallPaper.png';

    var stonesFactory = new helpers.rectangleFatory();
    stonesFactory.setMovementParameters(0, 10, 1);
    /*settings player*/
    var rectFactory = new helpers.rectangleFatory();
    rectFactory.setMovementParameters(2, 2, 6, -1);
    Ui.player = rectFactory.create({
        x: 140,
        y: 10,
        w: 20,
        h: 20,
        img: "player"
    });
    Ui.player.setSpriteDecorator(new SpriteDecorator(Ui.player.sprite));
    Ui.player.spriteDecorator.setReversible();
    Ui.player.spriteDecorator.setLeft();
    rectFactory.overrideMovementParameters({
        speed: {
            right: 0,
            down: 0
        }
    });
    Ui.otherPlayer = rectFactory.create({
        x: 140,
        y: 10,
        w: 20,
        h: 20,
        img: "otherPlayer"
    });
    Ui.otherPlayer.spriteDecorator.setReversible();
    Ui.otherPlayer.spriteDecorator.setLeft();
    Ui.otherPlayerBullet = null;

    /*settings bullet destroyed*/
    rectFactory.setMovementParameters(0, 0, 19, 0);
    var bulletDestroyed = rectFactory.create({
        x: 0,
        y: 0,
        w: 20,
        h: 20,
        img: "bulletDestroyed"
    });
    Ui.rectDec = new RectangleDecorator(bulletDestroyed);
    Ui.bulletDestroyed = bulletDestroyed;
    var otherPlayerPosition = null;

    if(!(otherPlayerPosition = localStorage.getItem('otherPlayerPosition'))) {
        localStorage.setItem('otherPlayerPosition', Ui.otherPlayer.x + ',' + Ui.otherPlayer.y);
    } else {

        helpers.changeOther(otherPlayerPosition.split(',')[0], otherPlayerPosition.split(',')[1], Ui.otherPlayer);
        console.log(otherPlayerPosition);

    }



    if (localStorage.getItem('isOpLeft') === null) {
        localStorage.setItem('isOpLeft', '1');
    } else if (localStorage.getItem('isOpLeft') === '0') {
        Ui.otherPlayer.spriteDecorator.changeDirection();
    };


    return {
        cnv: cnv,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        wallpaper: wallpaper,
        stonesFactory: stonesFactory
    };

});
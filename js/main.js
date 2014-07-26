"use strict";
define(['RectangleDecorator', 'SpriteDecorator', 'helpers', 'changed', 'collision', 'Bullet', 'Ui'],
       function(RectangleDecorator, SpriteDecorator, helpers,changed, collision, Bullet, Ui, sounds) {



    var temporalSprites = [], that = this, socket = io.connect('http://localhost:1338');


    /*settings scene*/
    var cnv = document.getElementById("cnv");
    Ui.context = cnv.getContext("2d");

    Ui.context.__proto__.cls = function() {
        this.clearRect(0, 0, parseInt($("#cnv").css("width")), parseInt($("#cnv").css("height")));
    };

    Ui.context.fillStyle = "#334455";


    /*settings player*/
    var rectFactory = new helpers.rectangleFatory();
    rectFactory.setMovementParameters(2, 2, 6, -1);
    Ui.player = rectFactory.create({x: 140, y: 10, w: 20, h: 20, img: "player"});
    Ui.player.setSpriteDecorator(new SpriteDecorator(Ui.player.sprite));
    Ui.player.spriteDecorator.setReversible();
    Ui.player.spriteDecorator.setLeft();
    rectFactory.overrideMovementParameters({speed: {right: 0, down: 0}});
    Ui.otherPlayer = rectFactory.create({x: 140, y: 10, w: 20, h: 20, img: "otherPlayer"});
    Ui.otherPlayer.spriteDecorator.setReversible();
    Ui.otherPlayer.spriteDecorator.setLeft();
    Ui.otherPlayerBullet = null;

    /*settings bullet destroyed*/
    rectFactory.setMovementParameters(0, 0, 19, 0);
    var bulletDestroyed = rectFactory.create({x: 0, y: 0, w: 20, h: 20,
        img: "bulletDestroyed"});
    Ui.rectDec = new RectangleDecorator(bulletDestroyed);
    Ui.bulletDestroyed = bulletDestroyed;



    function nextFrame(step) {

        if (Ui.endOfGame) {
            alert(Ui.lastMessage);

            socket.disconnect();
            return;
        }



        if (Ui.life <= 0) {
            socket.emit('endOfLife');
        }

        Ui.context.cls();
        
        Ui.context.fillStyle = '#111';
        Ui.context.font = 'bold 15px sans-serif';
        Ui.context.textBaseline = 'bottom';
        Ui.context.fillText('Life: '+parseInt(Ui.life,10), 460, 20);
        Ui.context.fillStyle = '#f00';
        Ui.context.fillText('Enemy\'s life: '+parseInt(Ui.otherPlayerLife,10), 400, 40);
        
        helpers.temporalAnimations.nextState();
        helpers.drawArrayed(Ui.shelfs);
        helpers.drawArrayed(Ui.enemies);
        helpers.setPlayerDirection(socket, Ui.playerDirection, Ui.otherPlayer);
        Ui.player.move(Ui.playerDirection[0], Ui.playerDirection[1]);

        var out = collision(Ui.player, Ui.enemies, true);

        if (out[0] == 9 || out[0] == 1 || out[1] == 2) {

            Ui.life -= 0.025;
            socket.emit("fire");
        }

        if (Ui.otherPlayerBullet) {
            out = collision(Ui.player, [Ui.otherPlayerBullet]);
            if (out[0] == 9 || out[0] == 1 || out[1] == 2) {
                Ui.life -= 1;
                socket.emit("bingo");
            }
            Ui.otherPlayerBullet.draw(Ui.context);
        }


        if (Ui.faceToLeft.now != Ui.faceToLeft.prev) {
            socket.emit("changeDirection");
            Ui.player.spriteDecorator.changeDirection();
        }



        Ui.player.draw(Ui.context);

        if (Ui.bullet) {
            Bullet.moveBullet(Ui.bullet);
        }

        Ui.otherPlayer.draw(Ui.context);


        changed({"type": "changed"});
        Ui.faceToLeft.prev = Ui.faceToLeft.now;
    };
    
    
    
    
    
    return {nextFrame: nextFrame, socket: socket}





});







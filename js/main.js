"use strict";
define(["Rectangle", "RectangleDecorator", "Sprite", "SpriteDecorator", "helpers", "changed", "collision",
        "Bullet", "Ui", "jquery", 'sounds'],
       function(Rectangle, RectangleDecorator, Sprite, SpriteDecorator, helpers,changed, collision,
                Bullet, Ui, $, sounds) {



    var temporalSprites = [], that = this;



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
    var otherPlayer = rectFactory.create({x: 140, y: 10, w: 20, h: 20, img: "otherPlayer"});
    otherPlayer.spriteDecorator.setReversible();
    otherPlayer.spriteDecorator.setLeft();
    var otherPlayerBullet = null;

    /*settings bullet destroyed*/
    rectFactory.setMovementParameters(0, 0, 19, 0);
    var bulletDestroyed = rectFactory.create({x: 0, y: 0, w: 20, h: 20,
        img: "bulletDestroyed"});
    Ui.rectDec = new RectangleDecorator(bulletDestroyed);
    Ui.bulletDestroyed = bulletDestroyed;



    var socket = io.connect('http://localhost:1338');
    socket.emit('rrun');
    Ui.player.socket = socket;


    Bullet.runBullet.socket = socket;
    Ui.player.eventOnMove = "playerMoved";
    socket.on('initGame', function(data) {

        helpers.addRectangles(Ui.shelfs, data, 17);

    });

    socket.on('initEnemies', function(data) {

        helpers.addRectangles(Ui.enemies, data, 17);

    });




    socket.on('rrun', function() {
        otherPlayer.spriteDecorator.setLeft();
    });
    socket.on("nextFrame", function() {
        nextFrame(0);
    });

    socket.on('move', function(data) {
        Ui.otherPlayerPrevX = otherPlayer.x;
        Ui.otherPlayerPrevY = otherPlayer.y;
        helpers.changeOther(data[0], data[1], otherPlayer);

    });
    socket.on('bulletFired', function(data) {


        rectFactory.setMovementParameters(3, 0, 5, data[2]);
        otherPlayerBullet = rectFactory.create({x: data[0], y: data[1], w: 20, h: 10, img: "otherPlayerBullet"});
        sounds.bombFly();
    });
    socket.on('bulletMove', function(data) {
        otherPlayerBullet.x = data.x;
        otherPlayerBullet.y = data.y;
    });

    socket.on('bulletDestroy', function() {




        bulletDestroyed.x = otherPlayerBullet.x;
        bulletDestroyed.y = otherPlayerBullet.y - 10;
        helpers.temporalAnimations.addOne(bulletDestroyed);
        sounds.explosion();      
        sounds.stopFlying();
        

        otherPlayerBullet = null;
    });

    socket.on('stop', function() {
        Ui.otherPlayerPrevX = otherPlayer.x;
        Ui.otherPlayerPrevY = otherPlayer.y;
    });


    socket.on('otherAreHit', function() {
        Ui.otherPlayerLife -= 1;    
    });

    socket.on('changeDirection', function() {
        otherPlayer.spriteDecorator.changeDirection();
    });

    socket.on('otherInFire', function() {
        Ui.otherPlayerLife -= 0.025;
    });


    socket.on('theEnd', function(data) {
        Ui.endOfGame = true;
        Ui.lastMessage = data ? 'You won' : 'You lose';
    });




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
        helpers.setPlayerDirection(socket, Ui.playerDirection, otherPlayer);
        Ui.player.move(Ui.playerDirection[0], Ui.playerDirection[1]);

        var out = collision(Ui.player, Ui.enemies, true);

        if (out[0] == 9 || out[0] == 1 || out[1] == 2) {

            Ui.life -= 0.025;
            socket.emit("fire");
        }

        if (otherPlayerBullet) {
            out = collision(Ui.player, [otherPlayerBullet]);
            if (out[0] == 9 || out[0] == 1 || out[1] == 2) {
                Ui.life -= 1;
                socket.emit("bingo");
            }
            otherPlayerBullet.draw(Ui.context);
        }


        if (Ui.faceToLeft.now != Ui.faceToLeft.prev) {
            socket.emit("changeDirection");
            Ui.player.spriteDecorator.changeDirection();
        }



        Ui.player.draw(Ui.context);

        if (Ui.bullet) {
            Bullet.moveBullet(Ui.bullet);
        }

        otherPlayer.draw(Ui.context);


        changed({"type": "changed"});
        Ui.faceToLeft.prev = Ui.faceToLeft.now;
    }





});







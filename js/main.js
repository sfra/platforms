"use strict";
define(["Rectangle", "RectangleDecorator", "Sprite", "SpriteDecorator", "helpers", "collision",
        "Bullet", "Ui", "jquery", 'sounds'],
       function(Rectangle, RectangleDecorator, Sprite, SpriteDecorator, helpers, collision,
                Bullet, Ui, $, sounds) {



    var KEYNUMBER = helpers.KEYNUMBER, KEYSTRING = helpers.KEYSTRING,
            shelfs = [], enemies = [], temporalSprites = [], that = this;

    var playerDirection = [0, 1];
    

    var ui = {
      
        changed: function(data) {
            var posAccToCanvasShelfs = collision(player, context, shelfs)[0];
            var left = posAccToCanvasShelfs & 1;
            var right = posAccToCanvasShelfs & 2;
            var top = (posAccToCanvasShelfs & 4) | (posAccToCanvasShelfs& 16) ;
            var bottom = posAccToCanvasShelfs & 8;

            playerDirection = [0, 1];

            if (left) {

                this.left = false;
            }
            if (right) {

                this.right = false;
            }

            if (top) {

                this.up = false;
            }

            if (bottom) {
                this.down = true;
                playerDirection[1] = 0;
                player.jumpable = true;
            } else if (!player.jumpable) {
                playerDirection[1] = 1;


            } else {
                this.down = false;

            }

            if (this.left) {
                playerDirection[0] = -player.speed.right;
            }

            if (this.right) {
                playerDirection[0] = player.speed.right;
            }

        }
    };

    helpers.ext(ui, Ui);


    /*settings scene*/
    var cnv = document.getElementById("cnv");
    var context = cnv.getContext("2d");
    context.__proto__.cls = function() {
        this.clearRect(0, 0, parseInt($("#cnv").css("width")), parseInt($("#cnv").css("height")));
    };

    context.fillStyle = "#334455";


    /*settings player*/
    var rectFactory = new helpers.rectangleFatory();
    rectFactory.setMovementParameters(2, 2, 6, -1);
    var player = rectFactory.create({x: 140, y: 10, w: 20, h: 20, img: "player"});
    player.setSpriteDecorator(new SpriteDecorator(player.sprite));
    player.spriteDecorator.setReversible();
    player.spriteDecorator.setLeft();
    rectFactory.overrideMovementParameters({speed: {right: 0, down: 0}});
    var otherPlayer = rectFactory.create({x: 140, y: 10, w: 20, h: 20, img: "otherPlayer"});
    otherPlayer.spriteDecorator.setReversible();
    otherPlayer.spriteDecorator.setLeft();
    var otherPlayerBullet = null;

    /*settings bullet destroyed*/
    rectFactory.setMovementParameters(0, 0, 19, 0);
    var bulletDestroyed = rectFactory.create({x: 0, y: 0, w: 20, h: 20,
        img: "bulletDestroyed"});
    var rectDec = new RectangleDecorator(bulletDestroyed);
    Ui.bulletDestroyed = bulletDestroyed;
    Ui.rectDec = rectDec;
    /*injections*/
    Rectangle.ui = ui;
    collision.ui = ui;
    //Bullet.runBullet.ui = ui;
   // Bullet.moveBullet.ui = ui;
    Bullet.moveBullet.context = context;
    Bullet.moveBullet.shelfs = shelfs;
    helpers.temporalAnimations.context = context;




    var socket = io.connect('http://localhost:1338');
    socket.emit('rrun');
    player.socket = socket;


    Bullet.runBullet.socket = socket;
    player.eventOnMove = "playerMoved";
    socket.on('initGame', function(data) {

        helpers.addRectangles(shelfs, data, 17);

    });

    socket.on('initEnemies', function(data) {

        helpers.addRectangles(enemies, data, 17);

    });




    socket.on('rrun', function() {
        otherPlayer.spriteDecorator.setLeft();
    });
    socket.on("nextFrame", function() {
        nextFrame(0);
    });

    socket.on('move', function(data) {
        ui.otherPlayerPrevX = otherPlayer.x;
        ui.otherPlayerPrevY = otherPlayer.y;
        helpers.changeOther(data[0], data[1], otherPlayer);

    });
    socket.on('bulletFired', function(data) {


        rectFactory.setMovementParameters(3, 0, 5, data[2]);
        otherPlayerBullet = rectFactory.create({x: data[0], y: data[1], w: 20, h: 10, img: "otherPlayerBullet"});
sounds.bombFly();
//         otherPlayerBullet=new Rectangle(data[0],data[1]+3,20,10,"img:otherPlayerBullet",{right:3,down:0},data[2],5);

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
        //    otherPlayer.sprite.animate(false);
        ui.otherPlayerPrevX = otherPlayer.x;
        ui.otherPlayerPrevY = otherPlayer.y;
    });


    socket.on('otherAreHit', function() {
        ui.otherPlayerLife -= 1;
      //  $('#otherPlayerLife').html(ui.otherPlayerLife);
    });

    socket.on('changeDirection', function() {
        otherPlayer.spriteDecorator.changeDirection();
    });

    socket.on('otherInFire', function() {
        ui.otherPlayerLife -= 0.025;
        //$('#otherPlayerLife').html(parseInt(ui.otherPlayerLife,10));
    });


    socket.on('theEnd', function(data) {
        ui.endOfGame = true;
        ui.lastMessage = data ? 'You won' : 'You lose';
    });




    function nextFrame(step) {

        if (ui.endOfGame) {
            alert(ui.lastMessage);

            socket.disconnect();
            return;
        }



        if (ui.life <= 0) {
            socket.emit('endOfLife');
        }

        context.cls();
        
        context.fillStyle = '#111';
        context.font = 'bold 15px sans-serif';
        context.textBaseline = 'bottom';
        context.fillText('Life: '+parseInt(ui.life,10), 460, 20);
        context.fillStyle = '#f00';
        context.fillText('Enemy\'s life: '+parseInt(ui.otherPlayerLife,10), 400, 40);
        
        helpers.temporalAnimations.nextState();
        helpers.drawArrayed(shelfs, context);
        helpers.drawArrayed(enemies, context);
        helpers.setPlayerDirection(ui, socket, playerDirection, otherPlayer);
        player.move(playerDirection[0], playerDirection[1]);

        var out = collision(player, context, enemies, true);

        if (out[0] == 9 || out[0] == 1 || out[1] == 2) {

            ui.life -= 0.025;
           // $('#life').html(parseInt(ui.life));
            socket.emit("fire");
        }

        if (otherPlayerBullet) {
            out = collision(player, context, [otherPlayerBullet]);
            if (out[0] == 9 || out[0] == 1 || out[1] == 2) {
                ui.life -= 1;
             //   $('#life').html(ui.life);
                socket.emit("bingo");
            }
            otherPlayerBullet.draw(context);
        }


        if (Ui.faceToLeft.now != Ui.faceToLeft.prev) {
            socket.emit("changeDirection");
            player.spriteDecorator.changeDirection();
        }




        //if (typeof helpers.temporalAnimations !==undefined) {
        //            console.log(helpers.temporalAnimations.currentAnimations);
        //}


        player.draw(context);

        if (Ui.bullet) {
            Bullet.moveBullet(Ui.bullet);
        }

        otherPlayer.draw(context);


        ui.changed({"type": "changed"});
        Ui.faceToLeft.prev = Ui.faceToLeft.now;
    }






    $("body").on("keydown", function(e) {
        switch (KEYSTRING[e.keyCode]) {
            case "left":
                ui.left = true;
                ui.right = false;
                Ui.faceToLeft.prev = Ui.faceToLeft.now;
                Ui.faceToLeft.now = true;
                Ui.bulletDirection = -1;

                break;
            case "right":
                ui.right = true;
                ui.left = false;
                Ui.faceToLeft.prev = Ui.faceToLeft.now;
                Ui.faceToLeft.now = false;
                Ui.bulletDirection = 1;
                break;
            case "space":
                if (player.jumpable && ui.isJumping === false && ui.down) {
                    ui.isJumping = [-4, -4, -3, -3, -3, -3, -2, -2, -2, -2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1];
                    player.jumpable = false;
                }
                ;
                break;
            case "shift":
                ui.turbo = 2;
                break;
            case "z":
                Ui.bullet = Bullet.runBullet(player.x, player.y, Ui.bulletDirection);
        }

    }).on("keyup", function(e) {

        switch (KEYSTRING[e.keyCode]) {
            case "left":
                ui.left = false;
                break;
            case "right":
                ui.right = false;
                break;
            case "space":
                break;
            case "shift":
                ui.turbo = 1;
                break;
        }


    });



});







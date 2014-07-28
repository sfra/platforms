define(['Ui','socketio','Bullet','sounds','helpers','main'],function(Ui, socketio, Bullet, sounds, helpers,main){
    
    console.log(Ui.player);
    var rectFactory = new helpers.rectangleFatory();
    var socket=main.socket;
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
        Ui.otherPlayer.spriteDecorator.setLeft();
    });
    socket.on("nextFrame", function() {
        main.nextFrame(0);
    });

    socket.on('move', function(data) {
        Ui.otherPlayerPrevX = Ui.otherPlayer.x;
        Ui.otherPlayerPrevY = Ui.otherPlayer.y;
        helpers.changeOther(data[0], data[1], Ui.otherPlayer);

    });
    socket.on('bulletFired', function(data) {


        rectFactory.setMovementParameters(3, 0, 5, data[2]);
        Ui.otherPlayerBullet = rectFactory.create({x: data[0], y: data[1], w: 20, h: 10, img: "otherPlayerBullet"});
        sounds.bombFly();
    });
    socket.on('bulletMove', function(data) {
        Ui.otherPlayerBullet.x = data.x;
        Ui.otherPlayerBullet.y = data.y;
    });

    socket.on('bulletDestroy', function() {




        Ui.bulletDestroyed.x = Ui.otherPlayerBullet.x;
        Ui.bulletDestroyed.y = Ui.otherPlayerBullet.y - 10;
        helpers.temporalAnimations.addOne(Ui.bulletDestroyed);
        sounds.explosion();      
        sounds.stopFlying();
        

        Ui.otherPlayerBullet = null;
    });

    socket.on('stop', function() {
        Ui.otherPlayerPrevX = Ui.otherPlayer.x;
        Ui.otherPlayerPrevY = Ui.otherPlayer.y;
    });


    socket.on('otherAreHit', function() {
        Ui.otherPlayerLife -= 1;    
    });

    socket.on('changeDirection', function() {
        Ui.otherPlayer.spriteDecorator.changeDirection();
    });

    socket.on('otherInFire', function() {
        Ui.otherPlayerLife -= 0.025;
    });


    socket.on('theEnd', function(data) {
        Ui.endOfGame = true;
        Ui.lastMessage = data ? 'You won' : 'You lose';
    });




});
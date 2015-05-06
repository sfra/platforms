define(['helpers', 'changed', 'collision', 'Bullet', 'Ui', 'dom/animations',
        'socketio', 'init'], function (helpers, changed, collision, Bullet, Ui,
    animations, io, init) {
    'use strict';


    var that = this,
        socket = io.connect('http://0.0.0.0:1338?xxx=1111'),
        stones = [];

    socket.emit('myNumber', Ui.myNumber);


    var cnv = init.cnv;
    var canvasWidth = init.canvasWidth;
    var canvasHeight = init.canvasHeight;
    var wallpaper = init.wallpaper;
    var stonesFactory = init.stonesFactory;


    function nextFrame(step) {

        if (Ui.endOfGame) {
            alert(Ui.lastMessage);
            socket.disconnect();
            return;
        };

        if (Ui.life <= 0) {
            socket.emit('endOfLife');
        };

        Ui.context.cls();
        Ui.context.fillStyle = '#111';
        Ui.context.drawImage(wallpaper, 0, 0);
        Ui.context.font = 'bold 15px sans-serif';
        Ui.context.textBaseline = 'bottom';
        Ui.context.fillText('Life: ' + parseInt(Ui.life, 10), 460, 20);
        Ui.context.fillStyle = '#f00';
        Ui.context.fillText('Enemy\'s life: ' +
            parseInt(Ui.otherPlayerLife, 10), 400, 40);

        helpers.temporalAnimations.nextState();
        helpers.drawArrayed(Ui.shelfs);
        helpers.drawArrayed(Ui.enemies);
        helpers.setPlayerDirection(socket, Ui.playerDirection, Ui.otherPlayer);
        Ui.player.move(Ui.playerDirection[0], Ui.playerDirection[1]);

        if (Ui.newStone) {
            stones.push(stonesFactory.create({
                x: Ui.newStone.x,
                y: -20,
                w: 20,
                h: 20,
                img: 'stone2'
            }));
            Ui.newStone = false;
        };

        var out = collision(Ui.player, Ui.enemies, true);

        if (out[0] === 9 || out[0] === 1 || out[1] === 2) {
            socket.emit('fire');
        };

        out = collision(Ui.player, stones);

        if (out[0] === 9 || out[0] === 1 || out[1] === 2) {
            if (Ui.isSickStage === 0) {
                Ui.isSickStage = 10;
            };
            socket.emit('bingo');
        };

        if (Ui.otherPlayerBullet) {
            out = collision(Ui.player, [Ui.otherPlayerBullet]);
            if (out[0] === 9 || out[0] === 1 || out[1] === 2) {
                if (Ui.isSickStage === 0) {
                    Ui.isSickStage = 10;
                };
                socket.emit('bingo');
            };
            Ui.otherPlayerBullet.draw(Ui.context);
        };

        if (Ui.faceToLeft.now !== Ui.faceToLeft.prev) {
            socket.emit("changeDirection", Ui.faceToLeft.now);
            Ui.player.spriteDecorator.changeDirection();
        };

        Ui.player.draw(Ui.context);

        if (Ui.isSickStage > 0) {
            helpers.makeSick(Ui.context, Ui.player);
            Ui.isSickStage -= 1;
        };

        if (Ui.bullet) {
            Bullet.moveBullet(Ui.bullet);
        };

        for (var st = 0, max = stones.length; st < max; st++) {
            stones[st].y += 5;
            stones[st].draw(Ui.context);
            if (stones[st].y > parseInt(canvasHeight, 10)) {
                stones.splice(st, 1);
                max -= 1;
                st -= 1;
            };
        };

        Ui.otherPlayer.draw(Ui.context);

        if (Ui.isSickStageEnemy > 0) {
            helpers.makeSick(Ui.context, Ui.otherPlayer);
            Ui.isSickStageEnemy -= 1;
        };

        changed({
            "type": "changed"
        });

        Ui.faceToLeft.prev = Ui.faceToLeft.now;
    };

    return {
        nextFrame: nextFrame,
        socket: socket
    };

});
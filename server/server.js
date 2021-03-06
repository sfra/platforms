"use strict";


let Server = {};

Server.sockets = [];
Server.socketsLife = [100, 100];
Server.endOfGame = false;
let enemies_moving = require('./enemies.moving.json');
let stoneNumber = 0;
let numberOfStones = enemies_moving.length;
Server.nextFrame = function (io, sockets) {

    let i = 0;


    if (Server.endOfGame) {

        for (i = 0; i < sockets.length; i++) {
            if (sockets[i].living) {
                sockets[i].emit('theEnd', true);
            } else {
                sockets[i].emit('theEnd', false);
            }
            ;
        }
        ;


    }



    if (Math.random() < 0.003) {

        for (i = 0; i < sockets.length; i++) {
            sockets[i].emit('stone2', enemies_moving[stoneNumber]);

            if (i === sockets.length - 1) {
                stoneNumber += 1;
                if (stoneNumber >= numberOfStones) {
                    stoneNumber = 0;
                }
                ;

            }
            ;
        }
        ;
    }
    ;



    for (i = 0; i < sockets.length; i++) {

        sockets[i].emit('life', Server.socketsLife);
        sockets[i].emit('nextFrame');

    }
    ;

    if (Server.endOfGame) {
        for (i = 0; i < sockets.length; i++) {
            Server.sockets[i].end();
        };

        Server.sockets = [];

    }
    ;


};




Server.dispatch = function (socket, sockets, eventReceived, eventToSend) {
    let _eventToSend = eventToSend !== undefined ? eventToSend : eventReceived;
    socket.on(eventReceived, function (data) {
        

        
         for (let sock = 0; sock < sockets.length; sock += 1) {
            if (sockets[sock] !== socket) {
                sockets[sock].emit(_eventToSend, data);
                switch (eventReceived) {
                    case 'bingo':
                        Server.socketsLife[1 - sock] -= 1;
                    case 'fire' :
                        Server.socketsLife[1 - sock] -= 0.025;
                }

            }

        }
        ;
    });

};



(function server() {
    let io = require('socket.io').listen(1338),
            shelfs = require('./shelfs.json'),
            enemies = require('./enemies.json'),
            sockets = Server.sockets,
            sock = 0; /*can sock be common?*/

    setInterval(function () {
        Server.nextFrame(io, sockets);
    }, 15);

    io.sockets.on('connection', function (socket) {
        socket.living = true;



        socket.emit('yourNumber', sockets.length);
        sockets.push(socket);
        socket.emit('initGame', shelfs);
        socket.emit('initEnemies', enemies);

//        console.log(enemies_moving);



        Server.dispatch(socket, sockets, 'rrun', 'rrun');
        Server.dispatch(socket, sockets, 'playerMoved', 'move');
        Server.dispatch(socket, sockets, 'changeDirection');
        Server.dispatch(socket, sockets, 'stop');
        Server.dispatch(socket, sockets, 'bulletFired');
        Server.dispatch(socket, sockets, 'bingo', 'otherAreHit');
        Server.dispatch(socket, sockets, 'fire', 'otherInFire');
        Server.dispatch(socket, sockets, 'bulletMove');
        Server.dispatch(socket, sockets, 'bulletDestroy');

       socket.on('disconnect',function (){
           socket.broadcast.emit('youWin');

       });
        socket.on('endOfLife', function (data) {
            socket.living = false;
            Server.endOfGame = true;


        });



    });

})();

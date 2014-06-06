"use strict";


var Server={};

Server.nextFrame=function(io, sockets){    
        var i = 0;
        for (i=0; i < sockets.length; i++) {
            sockets[i].emit("nextFrame");
        }
    
    };
    

        
        
Server.dispatch=function(socket,sockets,eventReceived,eventToSend){
        var _eventToSend=eventToSend!==undefined?eventToSend:eventReceived;
        socket.on(eventReceived,function(data){
                for (var sock=0;sock<sockets.length; sock+=1) {
                        if (sockets[sock]!=socket) {
                                sockets[sock].emit(_eventToSend,data);
                        }
                        
                        

                }
                });
        
        };        
        


(function server() {
    var io = require('socket.io').listen(1338),
    shelfs=require('./shelfs.json'),
    enemies=require('./enemies.json'),
    sockets=[],
    sock=0; /*can sock be common?*/

    setInterval(function(){Server.nextFrame(io,sockets);},10 );
    
    io.sockets.on('connection', function (socket) {
        sockets.push(socket);
        socket.emit('initGame', shelfs);
        socket.emit('initEnemies',enemies);
        Server.dispatch(socket,sockets,'rrun','rrun');
        Server.dispatch(socket,sockets,'playerMoved','move');
        Server.dispatch(socket,sockets,'changeDirection');
        Server.dispatch(socket,sockets,'stop');
        Server.dispatch(socket,sockets,'bulletFired');
        Server.dispatch(socket,sockets,'bingo','otherAreHit');
        Server.dispatch(socket,sockets,'fire','otherInFire');
        Server.dispatch(socket,sockets,'bulletMove');
        Server.dispatch(socket,sockets,'bulletDestroy');


      
    });

})();



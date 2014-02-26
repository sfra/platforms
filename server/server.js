"use strict";


var Server={};

Server.nextFrame=function(io, sockets){
        
        var i = 0;
        for (i=0; i < sockets.length; i++) {
            sockets[i].emit("nextFrame");
        }
    
    };



(function server() {
    var io = require('socket.io').listen(1338),
    shelfs=require('./shelfs.json'),
    sockets=[],
    sock=0; /*can sock be common?*/

    setInterval(function(){Server.nextFrame(io,sockets);},10 );
    
    
    
    io.sockets.on('connection', function (socket) {
      sockets.push(socket);
      socket.emit('initGame', shelfs);
      console.log(shelfs);
      socket.on('playerMoved', function (data) {
        for (sock=0;sock<sockets.length; sock+=1) {
            if (sockets[sock]!==socket) {
                sockets[sock].emit('move',data);
                
            } 
        }
       
      });
      
      
        socket.on('bulletFired',function(data){
            for (sock=0; sock<sockets.length; sock+=1) {
                if (sockets[sock]!=socket) {

                    sockets[sock].emit('bulletFired',data);
                }
            }
        
        
        });
        
        
        socket.on('bingo',function(){
            
            for (sock=0; sock<sockets.length;sock+=1) {
                if (sockets[sock]!==socket) {
                    sockets[sock].emit('otherAreHit');
                                        console.log("bingo");
                }
                
            }
            
            
            });
        
        
        
        
            socket.on('bulletMove',function(data){
            for (sock=0; sock<sockets.length; sock+=1) {
                if (sockets[sock]!=socket) {
                    console.log("Fired");
                    sockets[sock].emit('bulletMove',data);
                }
            }
        
        
        });
            
            
            
            
        socket.on('bulletDestroy',function(){
            for (sock=0; sock<sockets.length; sock+=1) {
                if (sockets[sock]!=socket) {
                    console.log("Fired");
                    sockets[sock].emit('bulletDestroy');
                }
            }
        
        
        });

      
    });

})();



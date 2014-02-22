"use strict";


var Server={};

Server.nextFrame=function(io, sockets){
        for (var i=0;i<sockets.length;i++) {
            sockets[i].emit("nextFrame");
        }
    
    };



(function server() {
    var io = require('socket.io').listen(1338);
    

    var shelfs=[
                {"geometry": [160,200,40,20],"color":"#112233","speed":{right:0,down:0}},
                {"geometry": [200,220,100,10],"color":"#112233","speed":{right:0,down:0}},
                {"geometry": [240,260,100,10],"color":"#112233","speed":{right:0,down:0}}
               ];
    
    var sockets=[];

    setInterval(function(){Server.nextFrame(io,sockets);},10 );
    
    
    
    io.sockets.on('connection', function (socket) {
      sockets.push(socket);
      socket.emit('initGame', shelfs);
      socket.on('playerMoved', function (data) {
        for (var sock=0;sock<sockets.length; sock++) {
            if (sockets[sock]!==socket) {
                sockets[sock].emit('move',data);
                
            } 
        }
       
      });
      
      
        socket.on('bulletFired',function(data){
            for (var sock=0; sock<sockets.length; sock++) {
                if (sockets[sock]!=socket) {

                    sockets[sock].emit('bulletFired',data);
                }
            }
        
        
        });
        
        
        socket.on('bingo',function(){
            
            for (var sock=0; sock<sockets.length;sock++) {
                if (sockets[sock]!==socket) {
                    sockets[sock].emit('otherAreHit');
                                        console.log("bingo");
                }
                
            }
            
            
            });
        
        
        
        
            socket.on('bulletMove',function(data){
            for (var sock=0; sock<sockets.length; sock++) {
                if (sockets[sock]!=socket) {
                    console.log("Fired");
                    sockets[sock].emit('bulletMove',data);
                }
            }
        
        
        });
            
            
            
            
        socket.on('bulletDestroy',function(){
            for (var sock=0; sock<sockets.length; sock++) {
                if (sockets[sock]!=socket) {
                    console.log("Fired");
                    sockets[sock].emit('bulletDestroy');
                }
            }
        
        
        });

      
    });

})();



"use strict";


var Server={};

Server.nextFrame=function(io, sockets){    
        var i = 0;
        for (i=0; i < sockets.length; i++) {
            sockets[i].emit("nextFrame");
        }
    
    };
    
Server.emitToOthers=function(socket,sockets,eventSend){
                
        
        return function(data){
                for (var sock=0;sock<sockets.length; sock+=1) {
                      if (sockets[sock]!==socket) {
                          sockets[sock].emit(eventSend,data);               
                      } 
                }        
        }
        
        
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
        
      //socket.on('rrun',function(){
      //  for (sock=0;sock<sockets.length;sock++) {
      //          if (sockets[sock]!==socket) {
      //               sockets[sock].emit('rrun');
      //          }
      //  }
      //  
      //  });  
  
        socket.on('rrun', Server.emitToOthers(socket,sockets,'rrun'));
        socket.on('playerMoved',Server.emitToOthers(socket,sockets,'move'));
        socket.on('changeDirection',Server.emitToOthers(socket,sockets,'changeDirection'));      
        socket.on('stop',Server.emitToOthers(socket,sockets,'stop'));
        socket.on('bulletFired',Server.emitToOthers(socket,sockets,'bulletFired'));
        socket.on('bingo',Server.emitToOthers(socket,sockets,'otherAreHit'));
        socket.on('fire',Server.emitToOthers(socket,sockets,'otherInFire'));
        socket.on('bulletMove',Server.emitToOthers(socket,sockets,'bulletMove'));
        socket.on('bulletDestroy',Server.emitToOthers(socket,sockets,'bulletDestroy'));






        //socket.on('fire',function(){
        //        
        //        for (sock=0; sock<sokets.length; sock+=1) {
        //               if (sokets[sock]!=socket) {
        //                    sockets[sock].emit('otherInFire');
        //               }
        //        }
        //        
        //        });
        //
        
        //socket.on('bulletMove',function(data){
        //    for (sock=0; sock<sockets.length; sock+=1) {
        //        if (sockets[sock]!=socket) {
        //            console.log("Fired");
        //            sockets[sock].emit('bulletMove',data);
        //        }
        //    }
        //});
           
        //socket.on('bulletDestroy',function(){
        //    for (sock=0; sock<sockets.length; sock+=1) {
        //        if (sockets[sock]!=socket) {
        //            console.log("Fired");
        //            sockets[sock].emit('bulletDestroy');
        //        }
        //    }
        //});




      //socket.on('playerMoved', function (data) {
      //  for (sock=0;sock<sockets.length; sock+=1) {
      //      if (sockets[sock]!==socket) {
      //          sockets[sock].emit('move',data);               
      //      } 
      //  }     
      //});
      
      
        //socket.on('bingo',function(){
        //    
        //    for (sock=0; sock<sockets.length;sock+=1) {
        //        if (sockets[sock]!==socket) {
        //            sockets[sock].emit('otherAreHit');
        //                                console.log("bingo");
        //        }
        //    }
        //});
      
      
      //socket.on('changeDirection',function(data){
      //      for (sock=0; sock<sockets.length; sock+=1) {
      //          if (sockets[sock]!=socket) {
      //              sockets[sock].emit('changeDirection',data);
      //          }
      //      }
      //  
      //  
      //  });
      
          
        //socket.on('stop',function(data){
        //    for (sock=0; sock<sockets.length; sock+=1) {
        //        if (sockets[sock]!=socket) {  
        //            sockets[sock].emit('stop');
        //        }
        //    }
        //});
      
        //
        //socket.on('bulletFired',function(data){
        //    for (sock=0; sock<sockets.length; sock+=1) {
        //        if (sockets[sock]!=socket) {
        //
        //            sockets[sock].emit('bulletFired',data);
        //        }
        //    }
        //});
        
        
      
        
        


      
    });

})();



'use strict';
define(["Rectangle"],function(Rectangle){
    
    
    return {
        
        ext: function(dest,src){
            for (var prop in src) {
                if (src.hasOwnProperty(prop)) {
                    dest[prop]=src[prop];
                }
            }
        }
        ,
        
        addRectangles:function(ar,data,numberOfFrames){
            
             for(var ob=0;ob<data.length;ob++){
        //debugger;
            ar.push(new Rectangle(data[ob].geometry[0],
                                 data[ob].geometry[1],
                                 data[ob].geometry[2],
                                 data[ob].geometry[3],
                                 data[ob].color,
                                 data[ob].speed,0,numberOfFrames
                                 ));            
      
            }
            
            
        },
        drawArrayed:function(arr,context){
            for (var i=0,max=arr.length;i<max;i++) {
                arr[i].draw(context);
            }
            
        },
        changeOther:function(x,y,otherPlayer){
            otherPlayer.x=x, otherPlayer.y=y;
        },
        
        setPlayerDirection:function(ui,socket,playerDirection, otherPlayer){
            if (ui.isJumping.length>0) {
            if (!ui.up) {
                ui.isJumping=false;
                playerDirection[1]=1;
            } else{
            playerDirection[1]=ui.isJumping.shift()*ui.turbo;            
            }            
        } else {
            ui.isJumping=false;
        }

        if(playerDirection[0]==0 && playerDirection[1]==0){
            socket.emit("stop")
            }        

        if (((ui.otherPlayerPrevX-otherPlayer.x ==0) &&
        (ui.otherPlayerPrevY-otherPlayer.y ==0))
            
            ){
            otherPlayer.sprite.animate(false);
        }
        else if((Math.abs(ui.otherPlayerPrevX-otherPlayer.x) != 2) ||
                (Math.abs(ui.otherPlayerPrevY-otherPlayer.y) != 1)){
            otherPlayer.sprite.animate(true);
        }
        
        },
        KEYNUMBER:{
            left:37, up:38,right:39,down: 40, space: 32, shift:16, z: 90
        },
        KEYSTRING:{
        "37":"left","38":"up","39":"right","40":"down", "32":"space","16":"shift",
        "90" : "z"
        }
        
        
        
    }
    
    
    
    
    
    });
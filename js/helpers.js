'use strict';
define(["Rectangle","Sprite","SpriteDecorator"],function(Rectangle,Sprite,SpriteDecorator){
    
    
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
        },
        
        rectangleFatory: function(){
            var speed={};
            var numberOfFrames;
            var direction;
            /**
             **@param {object}
             *or */
            /*@param{Number} right
             *@param{Number} down
             **/
            var setMovementParameters=function(){
                if (typeof arguments[0]==='object') {
                    speed.right=arguments[0].right;
                    speed.down=arguments[0].down;
                    numberOfFrames=arguments[1];
                    direction=arguments[2];
                   
                }
                speed.right=arguments[0]; speed.down=arguments[1]; numberOfFrames=arguments[2];
                direction=arguments[3];
            };
            
            
            var create=function(ob){
                var rect=new Rectangle(ob.x,ob.y,ob.w,ob.h);//,/*will be removed*/"img:"+ob.img,{right:speed.right, down:speed.down},direction,numberOfFrames);
               debugger;
                if (ob.img!=undefined) {
                    
                    rect.rewriteDraw();
                    rect.setSprite(new Sprite(ob.img,numberOfFrames,direction));
                    rect.setSpriteDecorator(new SpriteDecorator(rect.sprite));
                } else {
                    rect.color=ob.color;
                }
                
                rect.speed={right: speed.right, down:speed.down};
                console.log(rect);
                return rect;
            };
            
            var overrideMovementParameters=function(ob){
                speed=(ob.speed===undefined)?speed:ob.speed;
                numberOfFrames=(ob.numberOfFrames===undefined)?numberOfFrames:ob.numberOfFrames;
                direction=(ob.direction===undefined)?direction:ob.direction;

            }
            
            
            return {    setMovementParameters: setMovementParameters,
                        overrideMovementParameters:overrideMovementParameters,
                        create:create
                    };
            
    
        }
        
        
        
    }
    
    
    
    
    
    });
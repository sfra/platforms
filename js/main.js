"use strict";
define(["Rectangle","collision","Bullet","jquery"],function (Rectangle,collision,Bullet,$) {



var KEYNUMBER={
    left:37, up:38,right:39,down: 40, space: 32, shift:16, z: 90
    
}

var KEYSTRING={
    "37":"left","38":"up","39":"right","40":"down", "32":"space","16":"shift",
    "90" : "z"
}



var shelfs=[];


function changeOther(x,y) {
    otherPlayer.x=x;
    otherPlayer.y=y;
}


var playerDirection=[0,1];
var ui={
    life:100,
    otherPlayerLife:100,
    left:false,
    right: false,
    up: true,
    down: true,
    space: false,
    isJumping: false,
    eventFrameSync: 0,
    gameSpeed: 10,
    turbo: 1,
    bullet:false,
    bulletDirection:1,
    changed: function(data){
        var posAccToCanvas=collision(player,context, shelfs)[0];
        var left=posAccToCanvas & 1;
        var right=posAccToCanvas & 2;
        var top= posAccToCanvas & 4;
        var bottom=posAccToCanvas & 8;
                     
        playerDirection=[0,1];    
        
        if (left) {
            
            ui.left=false;
        }
        if (right) {
           
            ui.right=false;
        }
        
        if (top) {
            
            ui.up=false;
        }
        
        if (bottom) {
            ui.down=true;
            playerDirection[1]=0;
            player.jumpable=true;
        } else if(!player.jumpable) {
            playerDirection[1]=1;
           

         } else{
             ui.down=false;
            
         }
        
        if (ui.left) {
            playerDirection[0]=-player.speed.right;
        }
        
        if (ui.right) {
            playerDirection[0]=player.speed.right;
        }

    }    
};



var cnv=document.getElementById("cnv");
var context=cnv.getContext("2d");

var player=new Rectangle(140,10,20,20,"img:player",{right:2,down:2},-1,6);

var otherPlayer= new Rectangle(140,10,20,20, "img:otherPlayer",{right:0,down:0},-1,6);
var otherPlayerBullet=null;
Rectangle.ui=ui;

collision.ui=ui;
Bullet.runBullet.ui=ui;
Bullet.moveBullet.ui=ui;
Bullet.moveBullet.context=context;
Bullet.moveBullet.shelfs=shelfs;



context.__proto__.cls=function(){
    this.clearRect(0,0,parseInt($("#cnv").css("width")),parseInt($("#cnv").css("height")));    
}

context.fillStyle="#334455";


var socket = io.connect('http://localhost:1338');
player.socket=socket;
Bullet.runBullet.socket=socket;
player.eventOnMove="playerMoved";
    socket.on('initGame', function (data) {
    
    for(var ob=0;ob<data.length;ob++){
        //debugger;
        shelfs.push(new Rectangle(data[ob].geometry[0],
                                 data[ob].geometry[1],
                                 data[ob].geometry[2],
                                 data[ob].geometry[3],
                                 data[ob].color,
                                 data[ob].speed,0,17
                                 ));            
      
    }    


     //setInterval(
     //            function () { nextFrame(0);}, ui.gameSpeed
     //            );






//     setTimeout(function(){  nextFrame(0)   },ui.gameSpeed);   
        
    //console.log(data);
    //socket.emit('my other event', { my: 'data' });
  });    
  
  var that=this;
  
  socket.on("nextFrame",function(){
        nextFrame(0);
    });
  
  socket.on('move',function(data){
        otherPlayer.x=data[0];
        otherPlayer.y=data[1];
        console.log(shelfs);

    });  
    socket.on('bulletFired',function(data){
       // debugger;
        otherPlayerBullet=new Rectangle(data[0],data[1]+3,20,10,"img:otherPlayerBullet",{right:3,down:0},data[2],5);
       
    });
    socket.on('bulletMove',function(data){
        otherPlayerBullet.x=data;
        });
    
    socket.on('bulletDestroy',function(){
        otherPlayerBullet=null;
        });
    
    
    socket.on('otherAreHit',function(){
                        ui.otherPlayerLife-=1;
                $('#otherPlayerLife').html(ui.otherPlayerLife);

        });
    

function nextFrame(step) {
        context.cls();

        for (var i=0;i<shelfs.length;i++) {
            shelfs[i].draw(context);

        }
     
        if (ui.isJumping.length>0) {
            //debugger;
            if (!ui.up) {
                ui.isJumping=false;
                playerDirection[1]=1;

            } else{
            playerDirection[1]=ui.isJumping.shift()*ui.turbo;
            
            }
            
        } else {

            ui.isJumping=false;
        }
        
        

        


        player.move(playerDirection[0],playerDirection[1]);
     
        if (otherPlayerBullet) {
            var out=collision(player,context,[otherPlayerBullet]);
            if (out[0]==9 || out[0]==1 || out[1]==2) {

                    ui.life-=1;
                    $('#life').html(ui.life);            
            
            
                socket.emit("bingo");
                console.log(out);
            }
            
            otherPlayerBullet.draw(context);
        }
        
        



        player.draw(context);
        
        if(ui.bullet){
            Bullet.moveBullet(ui.bullet);
            };
        
        otherPlayer.draw(context);

        
        ui.changed({"type":"changed"});
        
 //       setTimeout(function(){nextFrame(step+1)},ui.gameSpeed);
   
}






$("body").on("keydown",function(e){
    
       
        switch (KEYSTRING[e.keyCode]) {
            case "left":
                ui.left=true; ui.right=false;
                //if (ui.bulletDirection==0) {
                    ui.bulletDirection=-1;
                //};
                break;
            case "right": ui.right=true; ui.left=false;
                //if (ui.bulletDirection==0) {
                    ui.bulletDirection=1;
                //};
            
            break;
            case "space": if(player.jumpable && ui.isJumping==false && ui.down){
                // ui.isJumping=[-2,-2,-2,-2,-2,-2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,,0,0,0,0,0,0,1,2,3]; player.jumpable=false;}; break;
                 ui.isJumping=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,1,1]; player.jumpable=false;}; break;
            case "shift":ui.turbo=2; break;
            case "z": ui.bullet=Bullet.runBullet(player.x,player.y,ui.bulletDirection);
            
        }
        
        
    }).on("keyup",function(e){
    
        switch (KEYSTRING[e.keyCode]) {
            case "left": ui.left=false; break;
            case "right": ui.right=false; break;
            case "space": break;
            case "shift": ui.turbo=1; break;
        }
    
    
    });



});





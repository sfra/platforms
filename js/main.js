"use strict";
define(["Rectangle","helpers","collision","Bullet","Ui","jquery"],function (Rectangle,helpers,collision,Bullet,Ui,$) {



var KEYNUMBER=helpers.KEYNUMBER, KEYSTRING=helpers.KEYSTRING,
    shelfs=[], enemies=[];

var playerDirection=[0,1];


var ui={
    changed: function(data){
        var posAccToCanvas=collision(player,context, shelfs)[0];
        var left=posAccToCanvas & 1;
        var right=posAccToCanvas & 2;
        var top= posAccToCanvas & 4;
        var bottom=posAccToCanvas & 8;
                     
        playerDirection=[0,1];    
        
        if (left) {
            
            this.left=false;
        }
        if (right) {
           
            this.right=false;
        }
        
        if (top) {
            
            this.up=false;
        }
        
        if (bottom) {
            this.down=true;
            playerDirection[1]=0;
            player.jumpable=true;
        } else if(!player.jumpable) {
            playerDirection[1]=1;
           

         } else{
             this.down=false;
            
         }
        
        if (this.left) {
            playerDirection[0]=-player.speed.right;
        }
        
        if (this.right) {
            playerDirection[0]=player.speed.right;
        }

    }    
};

helpers.ext(ui,Ui);


/*settings scene*/
var cnv=document.getElementById("cnv");
var context=cnv.getContext("2d");
context.__proto__.cls=function(){
    this.clearRect(0,0,parseInt($("#cnv").css("width")),parseInt($("#cnv").css("height")));    
};

context.fillStyle="#334455";


/*settings player*/
var player=new Rectangle(140,10,20,20,"img:player",{right:2,down:2},-1,6);
player.spriteDecorator.setReversible();
player.spriteDecorator.setLeft();
/*settings other player*/
var otherPlayer= new Rectangle(140,10,20,20, "img:otherPlayer",{right:0,down:0},-1,6);
otherPlayer.spriteDecorator.setReversible();
otherPlayer.spriteDecorator.setLeft();
var otherPlayerBullet=null;
/*injections*/
Rectangle.ui=ui;
collision.ui=ui;
Bullet.runBullet.ui=ui;
Bullet.moveBullet.ui=ui;
Bullet.moveBullet.context=context;
Bullet.moveBullet.shelfs=shelfs;





var socket = io.connect('http://localhost:1338');
player.socket=socket;
Bullet.runBullet.socket=socket;
player.eventOnMove="playerMoved";
    socket.on('initGame', function (data) {
    
    helpers.addRectangles(shelfs,data,17);
   
  });    
  
  socket.on('initEnemies',function(data){
           helpers.addRectangles(enemies,data,17);
     
    });
  
  
  var that=this;
  
  socket.on("nextFrame",function(){
        nextFrame(0);
    });
  
  socket.on('move',function(data){
        ui.otherPlayerPrevX=otherPlayer.x;
        ui.otherPlayerPrevY=otherPlayer.y;
        helpers.changeOther(data[0],data[1],otherPlayer);

    });  
    socket.on('bulletFired',function(data){
         otherPlayerBullet=new Rectangle(data[0],data[1]+3,20,10,"img:otherPlayerBullet",{right:3,down:0},data[2],5);
        
    });
    socket.on('bulletMove',function(data){
        otherPlayerBullet.x=data;
        });
    
    socket.on('bulletDestroy',function(){
        otherPlayerBullet=null;
        });
    
    socket.on('stop',function(){
    //    otherPlayer.sprite.animate(false);
        ui.otherPlayerPrevX=otherPlayer.x;
        ui.otherPlayerPrevY=otherPlayer.y;
        });
    
    
    socket.on('otherAreHit',function(){
                        ui.otherPlayerLife-=1;
                $('#otherPlayerLife').html(ui.otherPlayerLife);

        });
    
    socket.on('changeDirection',function(){
        otherPlayer.spriteDecorator.changeDirection();
        });
    

function nextFrame(step) {
        context.cls();
        helpers.drawArrayed(shelfs,context);
        helpers.drawArrayed(enemies,context);
        helpers.setPlayerDirection(ui,socket,playerDirection,otherPlayer);
        player.move(playerDirection[0],playerDirection[1]);
        var out=collision(player,context,enemies);
            if (out[0]==9 || out[0]==1 || out[1]==2) {
                    ui.life-=0.025;
                    $('#life').html(ui.life);            
                socket.emit("bingo");
            }
        
        if (otherPlayerBullet) {
            out=collision(player,context,[otherPlayerBullet]);
            if (out[0]==9 || out[0]==1 || out[1]==2) {

                    ui.life-=1;
                    $('#life').html(ui.life);                        
                socket.emit("bingo");
            }
            
            
            otherPlayerBullet.draw(context);
        }
        
               
       if(ui.faceToLeft.now != ui.faceToLeft.prev){    
            socket.emit("changeDirection");
            player.spriteDecorator.changeDirection(); 
        } 
        
                
        player.draw(context);
        
        if(ui.bullet){
            
            Bullet.moveBullet(ui.bullet);
        }
        
        otherPlayer.draw(context);

        
        ui.changed({"type":"changed"});
        ui.faceToLeft.prev=ui.faceToLeft.now;   
}






$("body").on("keydown",function(e){
        switch (KEYSTRING[e.keyCode]) {
            case "left":
                ui.left=true; ui.right=false;
                ui.faceToLeft.prev=ui.faceToLeft.now;
                ui.faceToLeft.now=true;
                ui.bulletDirection=-1;
                
                break;
            case "right": ui.right=true; ui.left=false;
                    ui.faceToLeft.prev=ui.faceToLeft.now;
                    ui.faceToLeft.now=false;
                    ui.bulletDirection=1;
                break;
            case "space": if(player.jumpable && ui.isJumping===false && ui.down){
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





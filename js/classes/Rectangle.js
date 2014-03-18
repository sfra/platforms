"use strict";

define(["socketio","Sprite","SpriteDecorator"],function(socket,Sprite,SpriteDecorator){

var i=0;
function Rectangle(x,y,w,h,fill,speed,direction,numberOfFrames) {
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
//    this.speed=speed || 0;

    if (speed) {
        this.speed=speed;
    }
    
    if (direction) {
        this.direction=direction;
    } else {
        this.direction=-1;
    }
    if (numberOfFrames) {
        this.numberOfFrames=numberOfFrames;
    }
    
    if (fill && fill.charAt(0)=='#') {
        this.color=fill;
    } else {
        this.color="#000000";
    }
    if (fill===undefined) {
        fill="";
    }
    
    
    try {
        
 
    
    var fillArray=fill.split(":");
    if (fillArray[0]=='img') {
        this.sprite=new Sprite(fillArray[1],this.numberOfFrames,this.direction);
        this.spriteDecorator=new SpriteDecorator(this.sprite);
        var that=this;
        this.draw=function(cnv){
            try {
             cnv.drawImage(that.sprite.getNextFrame(),that.x,that.y,that.w,that.h)   
            } catch(e) {
                console.log(this.sprite);
                console.log(e);
            };
        };
    } } catch(e){
        console.log(e);
        } 
    
    this.eventOnMove="";
    this.socket={emit:function(){}};
}

Rectangle.prototype.move=function(dx,dy){

    var charValueOfdy= ( dy===0? 0 : dy/Math.abs(dy) ) ;
    
    for (i=0;i<Math.abs(dy); i++) {
        this.y+=charValueOfdy;
        Rectangle.ui.changed({"type":"changed",
                              "x": this.x, "y":this.y, "w":this.w, "h":this.h  ,"dy":dy});
    }
    
    var charValueOfdx= ( dx===0? 0 : dx/Math.abs(dx) ) ;
    
    for (i=0;i<Math.abs(dx); i++) {
        this.x+=charValueOfdx;
        Rectangle.ui.changed({"type":"changed",
                              "x": this.x, "y":this.y, "w":this.w, "h":this.h  ,"dy":dy});
    }
    
    if (dx!==0 || dy!==0) {
        this.socket.emit(this.eventOnMove,[this.x, this.y]);
        this.sprite.animate(true);
    } else {
        this.sprite.animate(false);       
    }
}

Rectangle.prototype.draw=function(cnv){
    var previousFill=cnv.fillStyle;
    cnv.fillStyle=this.color;
    cnv.fillRect(this.x,this.y,this.w, this.h);
    cnv.fillStyle=previousFill;
}
Rectangle.prototype.spriteChangeDirection=function(){
    this.spriteDecorator.changeDirection();
}


Rectangle.prototype.setSprite=function(sprite){
    this.sprite=sprite;   
    
}

Rectangle.prototype.setSpriteDecorator=function(spriteDecorator){
    this.spriteDecorator=spriteDecorator;
}

return Rectangle;

});
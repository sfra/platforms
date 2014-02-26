"use strict";

define(["socketio","Sprite"],function(socket,Sprite){

var i=0;
function Rectangle(x,y,w,h,fill,speed,direction,numberOfFrames) {
    this.x=x;
    this.y=y;
    
    
    this.w=w;
    this.h=h;
    this.speed=speed;
    if (direction) {
        this.direction=direction;
    }
    if (numberOfFrames) {
        this.numberOfFrames=numberOfFrames;
    }

    
    if (fill && fill.charAt(0)=='#') {
        this.color=fill;
    } else {
        this.color="#000000";
    }
  //  console.log(this.direction);
    
    var fillArray=fill.split(":");
     if (fillArray[0]=='img') {
        console.log("numberOf Frames");
        console.log(this.numberOfFrames);
        
        this.sprite=new Sprite(fillArray[1],this.numberOfFrames,this.direction);
        var that=this;
        
        //drawing it the case of Sprite must be changed
        this.draw=function(cnv){
             cnv.drawImage(that.sprite.getNextFrame(),that.x,that.y,that.w,that.h);};
        //drawImage.bind(this);
    }
    
    
    this.eventOnMove="";
    this.socket={emit:function(){}};
    

// this.setDirection=function(direction){
//    this.direction=direction;
//    
//}
 
 
    
}



Rectangle.prototype.move=function(dx,dy){
//    this.x+=dx;
//    this.y+=dy;
    
    
    
    var charValueOfdy= ( dy===0? 0 : dy/Math.abs(dy) ) ;
    
    for (i=0;i<Math.abs(dy); i++) {
        this.y+=charValueOfdy;
        //console.log(Rectangle.ui);
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
    }
    
}

Rectangle.prototype.draw=function(cnv){
    var previousFill=cnv.fillStyle;
    cnv.fillStyle=this.color;
    cnv.fillRect(this.x,this.y,this.w, this.h);
    cnv.fillStyle=previousFill;
}

//Rectangle.prototype.setDirection=function(direction){
//    this.direction=direction;
//    
//}
// moved to anonymous function
//function drawImage(cnv) {
//
//    cnv.drawImage(this.sprite.getNextFrame(),this.x,this.y,this.w,this.h);
//}


return Rectangle;

});
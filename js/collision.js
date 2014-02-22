"use strict";


define([],function(){


function outside(rect,context,blocks) {
    var out=0;
    var theRest=1000;
    if (rect.x<=0) {
        out|=1;
    }
    
    if (rect.x+rect.w>= context.canvas.clientWidth) {
        out|=2;
    }
    
    
    if (rect.y<=0) {
        out|=4;
    }
    
    
    if (rect.y + rect.h>= context.canvas.clientHeight) {
        out|=8;
    }
    
    
    

    
    for (var i=0;i<blocks.length;i++) {

        if (rect.x+rect.w > blocks[i].x &&  rect.x< blocks[i].x+blocks[i].w && rect.y+rect.h==blocks[i].y) {

            out|=8; /*bottom*/
        } else{

        }
        
        
        if (rect.x+rect.w > blocks[i].x &&  rect.x< blocks[i].x+blocks[i].w && rect.y==blocks[i].y+blocks[i].h) {
        //debugger;
            out|=4; /*top*/
        } else{

            outside.ui.up=true;
        }
        
        
        
        
        
    
        
        if ( rect.y + rect.h > blocks[i].y  && rect.y < blocks[i].y+ blocks[i].h && rect.x+rect.w==blocks[i].x  ) {
          
                //        console.log(rect.speed.right);
            out|=2; /*right*/
        }
        
        
        if ( rect.y + rect.h > blocks[i].y  && rect.y < blocks[i].y+ blocks[i].h && rect.x-rect.speed.right<blocks[i].x+blocks[i].w && rect.x+rect.w>blocks[i].x ) {
//            debugger;
            console.log(rect.speed.right);
            out|=1; /*left*/
            theRest=Math.min(theRest, blocks[i].x+blocks[i].w-(rect.x-rect.speed.right));
        }
        
        
        
    
    
    }
    
    
    
    return [out,theRest];
};




    return outside;

});



define(['outOfCanvas'],function(outOfCanvas){

    "use strict";

    /**
    * Checks if Rectangle collides with any Rectangle in blocks
    *
    * @method outside
    * @param rect {Rectangle} 
    * @param context {Object} 
    * @param blocks {Array}
    * @param notCanvas {Boolean} optional. Check collision with boundaries of canvas
    * @return {Array} in which 0-element indicates collision
    */
    
    function outside(rect, context, blocks,notCanvas) {
        var out = !notCanvas?outOfCanvas(rect, context)[0]:0,
        i=0,
        theRest=1000; /*unused, so far*/
        
        
    
        for (i=0; i<blocks.length; i+=1) {

        if (rect.x+rect.w > blocks[i].x &&  rect.x < blocks[i].x+blocks[i].w && rect.y+rect.h===blocks[i].y) {
            out|=8; /*bottom*/
        } else{

        }
        
        
        //if (rect.x+rect.w > blocks[i].x &&  rect.x < blocks[i].x+blocks[i].w && rect.y===blocks[i].y+blocks[i].h) {
        //    out|=4; /*top*/
        //} else{
        //    outside.ui.up = true;
        //}
        
        
           if (rect.x+rect.w > blocks[i].x &&  rect.x < blocks[i].x+blocks[i].w && (rect.y>=blocks[i].y+blocks[i].h &&  rect.y-5<=blocks[i].y+blocks[i].h)) {
            out|=16; /*top*/
        } else{
            outside.ui.up = true;
        }
        
        
        
        
        if ( rect.y + rect.h > blocks[i].y  && rect.y < blocks[i].y+ blocks[i].h && rect.x+rect.w===blocks[i].x  ) {
            out|=2; /*right*/
        }
        
        if ( rect.y + rect.h > blocks[i].y  && rect.y < blocks[i].y+ blocks[i].h && rect.x-rect.speed.right<blocks[i].x+blocks[i].w && rect.x+rect.w>blocks[i].x ) {
            out|=1; /*left*/
            theRest = Math.min(theRest, blocks[i].x+blocks[i].w-(rect.x-rect.speed.right));
        }
    
    }
    
    return [out,theRest];
};

    return outside;

});
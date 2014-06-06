


define([],function(){

    "use strict";

    function outside(rect, context, blocks) {
        var out = 0,
        i=0,
        theRest=1000; /*unused, so far*/
        
        if (rect.x <= 0) {
            out|=1;
        }
    
        if (rect.x + rect.w >= context.canvas.clientWidth) {
            out|=2;
        }
    
    
        if (rect.y <= 0) {
            out|=4;
        }
    
    
        if (rect.y + rect.h >= context.canvas.clientHeight) {
            out|=8;
        }
    

    
    return [out,theRest];
};

    return outside;

});
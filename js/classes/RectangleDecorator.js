define(['Rectangle'],function(Rectangle){
'use strict';    

   var RectangleDecorator=function(rect){
        var _rect = rect;
        
        _rect.makeTemporal = function(times){
            
            _rect.times=times;
            
            var oldDraw=_rect.draw.bind(_rect);
            _rect.draw=function(cnv){
                if (this.times>0) {
                    oldDraw(cnv);
                    this.times -= 1;
                } else {
                  
                }
            }
        }
    
    
    
    };
    
    
    return RectangleDecorator;
    
});
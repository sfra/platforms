define(['Rectangle'],function(Rectangle){
    
    return (function(rect){
      
        var _rect=rect;
        
        _rect.draw=function(cnv){
            var imagePattern=_rect.sprite.getImages()[0];
            var previousFill=cnv.fillStyle;
          
          var pattern=cnv.createPattern(imagePattern,'repeat');
          cnv.fillStyle=pattern;
          
            cnv.fillRect(_rect.x,_rect.y,_rect.w,_rect.h);
          
          cnv.fillStyle=previousFill;
          
            
            
            
        }
        //var cnv = document.getElementById("cnv");
        //var context = cnv.getContext("2d"); 
        //
        });
      
      



});
'use strict';
define(["Rectangle"],function(Rectangle){
    
    
    return {
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
            
            
        }
        
        
    }
    
    
    
    
    
    });
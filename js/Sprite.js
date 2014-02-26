"use strict";

define([], function() {
    
    function Sprite(url, numberOfFrames, direction) {        
        var images = [],
            imagesRight = [],
            subfolder = "",
            nextFrameNumber = 0,
            i=0;
        
        if (direction === 1) {
            subfolder = "/right";
        }
        
        for (i = 0; i < numberOfFrames; i += 1) {
            images.push(new Image());
            images[i].src = "media/images/sprites/" + url + subfolder + "/0" + i + ".png";        
        }

        //console.log(images);
      

//        var nextFrameNumber = 0;
        
        this.getNextFrame = function() {
            
            
            var current = nextFrameNumber;
            
         //  console.log(images[current]);
           // debugger;
            if (nextFrameNumber + 1 === numberOfFrames) {
                nextFrameNumber = 0;
            } else {
                nextFrameNumber += 1;
            }
            return images[current];
        };
    }
    
    
    return Sprite;
});
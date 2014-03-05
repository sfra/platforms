"use strict";

define([], function() {
    
    function Sprite(url, numberOfFrames, direction) {        
        var images = [],
            imagesRight = [],
            subfolder = "",
            nextFrameNumber = 0,
            _numberOfFrames=numberOfFrames,
            i=0,
            that=this;
            
   
        this.setImages=function(right){
            for (i = 0; i < numberOfFrames; i += 1) {
                images.push(new Image());
                images[i].src = "media/images/sprites/" + url + (direction===1?"/right":"") + "/0" + i + ".png";
                
                if (this.isReversible) {
                    imagesRight[i]=new Image();
                    imagesRight[i].src = "media/images/sprites/" + url + "/right" + "/0" + i + ".png";
                }
            }       
        }

            
        if (direction === 1) {
            this.setImages(true);
        } else {
            this.setImages();
        }
        
        
        
        this.animate=function(start){
            if (start) {
                _numberOfFrames=numberOfFrames;
                return;
            }
            _numberOfFrames=1;
             nextFrameNumber=0;
        };        
            
        
        this.getNextFrame = function() {
            
          var current = nextFrameNumber;
            
            if (nextFrameNumber + 1 === numberOfFrames) {
                nextFrameNumber = 0;
            } else {
                nextFrameNumber += 1;
            }
            if (that.isReversible==undefined) {
                return images[current];
            }

            return that.left?images[current]:imagesRight[current];
        };
    };
    
    
    return Sprite;
});
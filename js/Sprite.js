"use strict";

define([], function() {
    
    function Sprite(url, numberOfFrames, direction) {        
        var images = [],
            imagesRight = [],
            subfolder = "",
            nextFrameNumber = 0,
            i=0,
            that=this;
            
       
        
        
       // this.isReversible=false;    
        this.setImages=function(right){
            for (i = 0; i < numberOfFrames; i += 1) {
                images.push(new Image());
                images[i].src = "media/images/sprites/" + url + (this.left==undefined?"":"/right") + "/0" + i + ".png";
                
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
        
        
        
        
        
        
        

        //console.log(images);
      

//        var nextFrameNumber = 0;
        
        this.getNextFrame = function() {
            
          var current = nextFrameNumber;
            
         //  console.log(images[current]);
           
            if (nextFrameNumber + 1 === numberOfFrames) {
                nextFrameNumber = 0;
            } else {
                nextFrameNumber += 1;
            }
            if (that.isReversible==undefined) {
                return images[current];
                        console.log("is reversible");
            }

            return that.left?images[current]:imagesRight[current];
        };
    }
    
    
    return Sprite;
});
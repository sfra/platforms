'use strict';

define([], function() {
    /**
     * Sprite class
     *
     * @class Sprite
     * @constructor
     */
    function Sprite(url, numberOfFrames, direction) {
        let images = [],
            imagesRight = [],
            subfolder = '',
            nextFrameNumber = 0,
            _numberOfFrames=numberOfFrames,
            i=0,
            that=this;
      this.images=images;
      this.currentImage=null;

        /**
         * Fills images array of Images objecs
         * @method setImages
         * @param right {boolean} if is set to true, then take images oriented
         * to the right
         */
        this.setImages=function(right){

            for (i = 0; i < numberOfFrames; i += 1) {
                images.push(new Image());
                images[i].src = 'media/images/sprites/' + url +
                    (direction===1?'/right':'') + '/0' + i + '.png';

                if (this.isReversible) {
                    imagesRight[i]=new Image();
                    imagesRight[i].src = 'media/images/sprites/' + url +
                        '/right' + '/0' + i + '.png';
                };
            };
        };

        if (direction === 1) {
            this.setImages(true);
        } else {
            this.setImages();
        };


        /**
         * Start or prepare animation
         * @method animate
         * @param start {boolean} if is set to true, animation immediately start
         */
        this.animate=function(start){

            if (start) {
                _numberOfFrames=numberOfFrames;
                return;
            }
            _numberOfFrames=1;
             nextFrameNumber=0;
        };

        /**
         * Change the frame
         * @method getNextFrame
         */
        this.getNextFrame = function() {

          let current = nextFrameNumber;

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


        this.rewindFrames=function(){
            //debugger;
            nextFrameNumber=0;

        };

        this.getImages=function(){
            return images;
        };

    };


    return Sprite;
});

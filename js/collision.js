define(['outOfCanvas', 'Ui'], function (outOfCanvas, Ui) {

    "use strict";

    /**
     * Checks if Rectangle collides with any Rectangle in blocks
     *
     * @method outside
     * @param rect {Rectangle}
     * @param context {Object}
     * @param blocks {Array}
     * @param notCanvas {Boolean} optional. Check collision with boundaries
     * of canvas
     * @return {Array} in which 0-element indicates collision
     */

    function outside(rect, blocks, notCanvas, movingShelfs) {
        let out = !notCanvas ? outOfCanvas(rect)[0] : 0,
            i = 0,
            theRest = 1000; /*unused, so far*/
        let forcedDirection = null;


        for (i = 0; i < blocks.length; i += 1) {

            if (rect.x + rect.w > blocks[i].x && rect.x < blocks[i].x +
                blocks[i].w && rect.y + rect.h === blocks[i].y) {
                out |= 8; /*bottom*/
    //            console.log(blocks[i]);
                if(blocks[i].playerDirection!==undefined) {
                    console.log(blocks[i].playerDirection);
                    forcedDirection = blocks[i].playerDirection;
                }
            };

            if (rect.x + rect.w > blocks[i].x && rect.x < blocks[i].x +
                blocks[i].w && (rect.y >= blocks[i].y + blocks[i].h &&
                    rect.y - 5 <= blocks[i].y + blocks[i].h)) {
                out |= 16; /*top*/
            } else {
                Ui.up = true;
            };

            if (rect.y + rect.h > blocks[i].y && rect.y < blocks[i].y +
                blocks[i].h && rect.x + rect.w === blocks[i].x) {
                out |= 2; /*right*/
            };

            if (rect.y + rect.h > blocks[i].y && rect.y < blocks[i].y +
                blocks[i].h && rect.x - rect.speed.right < blocks[i].x +
                blocks[i].w && rect.x + rect.w > blocks[i].x) {
                out |= 1; /*left*/
                theRest = Math.min(theRest, blocks[i].x + blocks[i].w - (rect.x - rect.speed.right));
            };

        };
        console.log([out, theRest,forcedDirection]);
        return [out, theRest,forcedDirection];

    };

    return outside;

});
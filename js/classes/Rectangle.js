"use strict";

define(["socketio", "Sprite", "SpriteDecorator", "changed"], function (socket, Sprite, SpriteDecorator, changed) {

    var i = 0;
    /**
     * Rectangle class
     *
     * @class Rectangle
     * @constructor
     */
    function Rectangle(x, y, w, h, fill, speed, direction, numberOfFrames) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;


        if (speed) {
            this.speed = speed;
        }

        if (direction) {
            this.direction = direction;
        } else {
            this.direction = -1;
        }
        if (numberOfFrames) {
            this.numberOfFrames = numberOfFrames;
        }

        if (fill && fill.charAt(0) == '#') {
            this.color = fill;
        } else {
            this.color = "#000000";
        }
        if (fill === undefined) {
            fill = "";
        }

        this.eventOnMove = "";
        this.socket = {emit: function () {
            }};
    }


    /**
     * If Rectangle is filled by Sprite, then overwrite the draw method
     *
     * @method rewriteDraw
     * 
     */
    Rectangle.prototype.rewriteDraw = function () {
        var that = this;
        this.draw = function (cnv) {

            cnv.drawImage(that.sprite.getNextFrame(), that.x, that.y, that.w, that.h);
        };
    };


    /**
     * Add dx and dx to this.x and this.y respectively.
     *
     * @method move
     * @param dx {Number} 
     * @param dy {Number} 
     */
    Rectangle.prototype.move = function (dx, dy) {

        var charValueOfdy = (dy === 0 ? 0 : dy / Math.abs(dy));

        for (i = 0; i < Math.abs(dy); i++) {
            this.y += charValueOfdy;
            changed({"type": "changed",
                "x": this.x, "y": this.y, "w": this.w, "h": this.h, "dy": dy});
        }

        var charValueOfdx = (dx === 0 ? 0 : dx / Math.abs(dx));

        for (i = 0; i < Math.abs(dx); i++) {
            this.x += charValueOfdx;
            changed({"type": "changed",
                "x": this.x, "y": this.y, "w": this.w, "h": this.h, "dy": dy});
        }

        if (dx !== 0 || dy !== 0) {
            this.socket.emit(this.eventOnMove, [this.x, this.y]);
            this.sprite.animate(true);
        } else {
            this.sprite.animate(false);
        }
    }

    /**
     * Draw the Rectangle on canvas. If Rectangle is filled by Sprite it can be overwritten
     *
     * @method draw
     * @param cvn {Object}
     */
    Rectangle.prototype.draw = function (cnv) {
        var previousFill = cnv.fillStyle;
        cnv.fillStyle = this.color;
        cnv.fillRect(this.x, this.y, this.w, this.h);
        cnv.fillStyle = previousFill;
    }

    Rectangle.prototype.spriteChangeDirection = function () {
        this.spriteDecorator.changeDirection();
    }


    Rectangle.prototype.setSprite = function (sprite) {
        this.sprite = sprite;

    }

    Rectangle.prototype.setSpriteDecorator = function (spriteDecorator) {
        this.spriteDecorator = spriteDecorator;
    }

    return Rectangle;

});
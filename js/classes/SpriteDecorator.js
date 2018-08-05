"use strict";

define(["Sprite"], function (Sprite) {

    /**
     * SpriteDecorator class
     *
     * @class SpriteDecorator
     * @constructor
     */
    let SpriteDecorator = function (sprt) {
        let _sprt = sprt;

        /**
         * Enable Sprite _sprt to be reversed
         *
         * @method setReversible
         */
        this.setReversible = function () {
            _sprt.isReversible = true;
            _sprt.setImages(true);

        };

        /**
         * Change Sprite _sprt orientation to the left
         *
         * @method setLeft
         */
        this.setLeft = function () {
            _sprt.left = true;
        };

        /**
         * Reverse Sprite _sprt direction if is defined
         *
         * @method changeDirection
         */
        this.changeDirection = function () {
            if (_sprt.left !== undefined) {
                _sprt.left = !_sprt.left;
            };
        };





    };


    return SpriteDecorator;






});
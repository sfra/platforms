define(['Rectangle'], function (Rectangle) {
    'use strict';

    var RectangleDecorator = function (rect) {
        var _rect = rect;
        var _times;
        var oldDraw = _rect.draw.bind(_rect);


        _rect.makeTemporal = function (times) {
            _times = times;
            // var that=this;
            _rect.draw = function (cnv) {
                if (_times > 0) {
                    _times -= 1;
                    oldDraw(cnv);

                }
            }
        };

        _rect.getTimes = function () {
            return _times;
        };

        _rect.setTimes = function (times) {
            _times = times;
        };




    };


    return RectangleDecorator;

});
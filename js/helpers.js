'use strict';
define(['Rectangle', 'RectangleDecoratorPattern', 'Sprite', 'SpriteDecorator', 'Ui'],
    function (Rectangle, RectangleDecoratorPattern, Sprite, SpriteDecorator, Ui) {


        return {
            ext: function (dest, src) {
                for (let prop in src) {
                    if (src.hasOwnProperty(prop)) {
                        dest[prop] = src[prop];
                    };
                };
            },

            addRectangles: function (arr, data, numberOfFrames) {
                let rectFatory = new this.rectangleFatory();
                rectFatory.setMovementParameters(0, 0, numberOfFrames, 0);
                let rectParametes = null;


                for (let ob = 0; ob < data.length; ob++) {
                    rectParametes = {
                        x: data[ob].geometry[0],
                        y: data[ob].geometry[1],
                        w: data[ob].geometry[2],
                        h: data[ob].geometry[3]
                    };


                    if (data[ob]['playerDirection'] !== undefined) {
                        rectParametes.playerDirection = data[ob]['playerDirection'];
                    };

                    if (data[ob].color[0] === '#') {
                        this.ext(rectParametes, {
                            color: data[ob].color
                        });
                    } else {
                        this.ext(rectParametes, {
                            img: data[ob].color.split(':')[1]
                        });
                    };


                    if (data[ob].numberOfFrames !== undefined) {
                        rectParametes.numberOfFrames = data[ob].numberOfFrames;
                    };

                    if (data[ob].pattern) {
                        let rect = rectFatory.create(rectParametes);
                        RectangleDecoratorPattern(rect);
                        arr.push(rect);
                        continue;
                    };

                    arr.push(rectFatory.create(rectParametes));

                };
            },

            drawArrayed: function (arr) {
                for (let i = 0, max = arr.length; i < max; i++) {
                    arr[i].draw(Ui.context);
                }

            },

            changeOther: function (x, y, otherPlayer) {
                otherPlayer.x = x, otherPlayer.y = y;
            },

            setPlayerDirection: function (socket, playerDirection, otherPlayer) {

                if (Ui.isJumping.length > 0) {
                    if (!Ui.up) {
                        Ui.isJumping = false;
                        playerDirection[1] = 1;
                    } else {
                        playerDirection[1] = Ui.isJumping.shift() * Ui.turbo;
                    };
                } else {
                    Ui.isJumping = false;
                };

                if (playerDirection[0] === 0 && playerDirection[1] === 0) {
                    socket.emit('stop');
                };

                if (((Ui.otherPlayerPrevX - otherPlayer.x === 0) &&
                        (Ui.otherPlayerPrevY - otherPlayer.y === 0))

                ) {
                    otherPlayer.sprite.animate(false);
                } else if ((Math.abs(Ui.otherPlayerPrevX - otherPlayer.x) !== 2) ||
                    (Math.abs(Ui.otherPlayerPrevY - otherPlayer.y) !== 1)) {
                    otherPlayer.sprite.animate(true);
                };

            },

            KEYNUMBER: {
                left: 37,
                up: 38,
                right: 39,
                down: 40,
                space: 32,
                shift: 16,
                z: 90
            },

            KEYSTRING: {
                '37': 'left',
                '38': 'up',
                '39': 'right',
                '40': 'down',
                '32': 'space',
                '16': 'shift',
                '90': 'z'
            },

            rectangleFatory: function () {
                let speed = {},
                    numberOfFrames, direction;

                let setMovementParameters = function () {
                    speed.right = arguments[0];
                    speed.down = arguments[1];
                    numberOfFrames = arguments[2];
                    direction = arguments[3];
                };


                let create = function (ob) {
                    let rect = new Rectangle(ob.x, ob.y, ob.w, ob.h);
                    let _numberOfFrames = numberOfFrames;

                    if (ob.numberOfFrames !== undefined) {
                        _numberOfFrames = ob.numberOfFrames;
                    };

                    if(ob.playerDirection!==undefined) {
                        rect.playerDirection = ob.playerDirection;
                    };


                    if (ob.img !== undefined) {
                        rect.rewriteDraw();
                        rect.setSprite(new Sprite(ob.img, _numberOfFrames, direction));
                        rect.setSpriteDecorator(new SpriteDecorator(rect.sprite));
                    } else {
                        rect.color = ob.color;
                    };

                    rect.speed = {
                        right: speed.right,
                        down: speed.down
                    };
                    return rect;

                };

                let overrideMovementParameters = function (ob) {
                    speed = (ob.speed === undefined) ? speed : ob.speed;
                    numberOfFrames = (ob.numberOfFrames === undefined) ?
                        numberOfFrames : ob.numberOfFrames;
                    direction = (ob.direction === undefined) ? direction : ob.direction;
                };


                return {
                    setMovementParameters,
                    overrideMovementParameters,
                    create
                };


            },

            temporalAnimations: {
                currentAnimations: [],
                addOne: function (rect, numberOfFrames) {
                    rect.makeTemporal(numberOfFrames);
                    this.currentAnimations.push(rect);
                },
                nextState: function () {
                    let i,
                        max = this.currentAnimations.length;

                    for (i = 0; i < max;) {

                        if (this.currentAnimations[i] === undefined) {
                            i += 1;
                            continue;
                        };

                        if (this.currentAnimations[i].getTimes() > 0) {
                            this.currentAnimations[i].draw(Ui.context);
                            i += 1;
                        } else {
                            this.currentAnimations[i].sprite.rewindFrames();
                            this.currentAnimations.splice(i, 1);
                        };
                    };
                }
            },

            makeSick: function (context, rect) {
                let imageData = context.getImageData(rect.x, rect.y, rect.w, rect.h),
                    points = imageData.data,
                    numberOfPoints = imageData.width * imageData.height;

                for (let i = 0; i < numberOfPoints; i++) {

                    if (Math.abs(points[i * 4] - 44) < 20 &&
                        Math.abs(points[i * 4 + 1] - 49) < 20 &&
                        Math.abs(points[i + 4 + 2] - 31) < 20) {
                        points[i * 4] = 0; //points[i * 4] < 100 ? 255 - points[i * 4] : points[i * 4];
                        points[i * 4 + 1] = 255; // points[i * 4 + 1] < 100 ? 255 - points[i * 4 + 1] : points[i * 4 + 1];
                        points[i * 4 + 2] = 0; //255 - points[i * 4 + 2];
                        continue;
                    };

                    if (points[i * 4] < 200 || points[i * 4 + 1] < 200 || points[i * 4 + 2] < 200) {
                        continue;
                    };

                    points[i * 4] = 255; //points[i * 4] < 100 ? 255 - points[i * 4] : points[i * 4];
                    points[i * 4 + 1] = 0; // points[i * 4 + 1] < 100 ? 255 - points[i * 4 + 1] : points[i * 4 + 1];
                    points[i * 4 + 2] = 0; //255 - points[i * 4 + 2];
                };

                if (window.context) {
                    window.context.putImageData(imageData, rect.x, rect.y);
                } else {
                    context.putImageData(imageData, rect.x, rect.y);
                };



            }

        };

    });

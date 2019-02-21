define(['helpers', 'Ui', 'Bullet'], function (helpers, Ui, Bullet) {
    'use strict';
    var KEYSTRING = helpers.KEYSTRING;
    var _body = document.body;

    _body.addEventListener('keydown', function (e) {
        switch (KEYSTRING[e.keyCode]) {
        case 'left':
            Ui.left = true;
            Ui.right = false;
            Ui.faceToLeft.prev = Ui.faceToLeft.now;
            Ui.faceToLeft.now = true;
            Ui.bulletDirection = -1;
            break;
        case 'right':
            Ui.right = true;
            Ui.left = false;
            Ui.faceToLeft.prev = Ui.faceToLeft.now;
            Ui.faceToLeft.now = false;
            Ui.bulletDirection = 1;
            break;
        case 'space':
            if (Ui.player.jumpable && Ui.isJumping === false && Ui.down) {
                Ui.isJumping = [-4, -4, -3, -3, -3, -3, -2, -2, -2, -2, -1,
                                    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                                    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                                    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                                    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                                    -1, -1, -1, -1, -1, 0, 1];
                Ui.player.jumpable = false;
            };
            break;
        case 'shift':
            Ui.turbo = 2;
            break;
        case 'z':
            Ui.bullet = Bullet.runBullet(Ui.player.x, Ui.player.y,
                Ui.bulletDirection);
            break;
        }



    }, false);


    _body.addEventListener('keyup', function (e) {
	e.preventDefault();
	
	
        switch (KEYSTRING[e.keyCode]) {
        case "left":
            Ui.left = false;
            break;
        case "right":
            Ui.right = false;
            break;
        case "space":
            break;
        case "shift":
            Ui.turbo = 1;
            break;
        }

//	Event.stop(e);
    }, false);






});

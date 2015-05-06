define(['Rectangle', 'RectangleDecorator', 'collision', 'helpers', 'sounds',
        'Ui', 'dom/animations'], function (Rectangle, RectangleDecorator,
    collision, helpers, sounds, Ui, animations) {
    var rectFactory = new helpers.rectangleFatory(),
        bulletDestroyed,
        _bulletDirection,
        rectDec,
        bulletFallingPhase = 0;


    function runBullet(x, y, bulletDirection) {
        if (Ui.bullet) {
            return Ui.bullet;
        };
        sounds.bombFly();
        bulletDestroyed = Ui.bulletDestroyed;
        rectDec = Ui.rectDec;
        var startModAccToPlayer = Ui.faceToLeft.now ? -1 : 1;
        _bulletDirection = bulletDirection;
        runBullet.socket.emit("bulletFired", [x + startModAccToPlayer * 10,
                                              y, bulletDirection]);
        rectFactory.setMovementParameters(3, 0, 5, bulletDirection);
        var outB = rectFactory.create({
            x: x + startModAccToPlayer * 10,
            y: y - 5,
            w: 20,
            h: 10,
            img: "bullet"
        });
        return outB;
    };




    function moveBullet(bullet) {
        var posAccToCanvasShelfs = collision(bullet, Ui.shelfs)[0];

        if (posAccToCanvasShelfs) {
            runBullet.socket.emit("bulletDestroy");
            animations.shake();
            bulletDestroyed.x = bullet.x;
            bulletDestroyed.y = bullet.y - 10;
            helpers.temporalAnimations.addOne(bulletDestroyed, 19);
            bulletFallingPhase = 0;
            delete Ui.bullet;
            sounds.explosion();
            sounds.stopFlying();
            Ui.bullet = false;
            return;
        };

        runBullet.socket.emit("bulletMove", {
            x: bullet.x,
            y: bullet.y
        });
        bullet.move(_bulletDirection * 3, Ui.bulletFalling[bulletFallingPhase]);
        if (bulletFallingPhase < Ui.bulletFalling.length - 1) {
            bulletFallingPhase += 1;
        };

        Ui.bullet.draw(Ui.context);
    };

    return {
        runBullet: runBullet,
        moveBullet: moveBullet
    };

});
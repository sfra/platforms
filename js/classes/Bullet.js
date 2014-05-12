
define(["Rectangle","collision","helpers"], function(Rectangle,collision,helpers){
    
    function runBullet(x, y, bulletDirection) {

        if (runBullet.ui.bullet) {
            return runBullet.ui.bullet;
        }

        var startModAccToPlayer=runBullet.ui.faceToLeft.now?-1:1;
        console.log(startModAccToPlayer);
        runBullet.bulletDirection = runBullet.ui.bulletDirection;
        runBullet.socket.emit("bulletFired", [x+startModAccToPlayer*10, y, runBullet.ui.bulletDirection]);
        var rectFactory=new helpers.rectangleFatory();
        rectFactory.setMovementParameters(3,0,5,runBullet.bulletDirection);
        var outB=rectFactory.create({x:x+startModAccToPlayer*10, y:y + 5, w:20, h:10, img:"bullet"});
        return outB;
    }


    function moveBullet(bullet) {
        var posAccToShelfs = collision(bullet, moveBullet.context, moveBullet.shelfs)[0];
        
        if (posAccToShelfs) {
         //  console.log(runBullet.bulletDirection);
            runBullet.socket.emit("bulletDestroy");
            delete moveBullet.ui.bullet;
            moveBullet.ui.bullet = false;
            return;
        }
    
        runBullet.socket.emit("bulletMove", bullet.x);
        bullet.move(runBullet.bulletDirection * 3, 0);
        moveBullet.ui.bullet.draw(moveBullet.context);
    }

    return {runBullet: runBullet, moveBullet: moveBullet};

});
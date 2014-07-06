
define(["Rectangle","RectangleDecorator","collision","helpers"], function(Rectangle,RectangleDecorator,collision,helpers){
    var rectFactory=new helpers.rectangleFatory(),
    bulletDestroyed,
    rectDec;;
            
    
    function runBullet(x, y, bulletDirection) {

        if (runBullet.ui.bullet) {
            return runBullet.ui.bullet;
        }

        bulletDestroyed=runBullet.ui.bulletDestroyed;
        rectDec=runBullet.ui.rectDec;
        var startModAccToPlayer=runBullet.ui.faceToLeft.now?-1:1;
        console.log(startModAccToPlayer);
        runBullet.bulletDirection = runBullet.ui.bulletDirection;
        runBullet.socket.emit("bulletFired", [x+startModAccToPlayer*10, y, runBullet.ui.bulletDirection]);

        rectFactory.setMovementParameters(3,0,5,runBullet.bulletDirection);
        var outB=rectFactory.create({x:x+startModAccToPlayer*10, y:y + 5, w:20, h:10, img:"bullet"});
        return outB;
    }
    
    
        

    function moveBullet(bullet) {
                
        
        var posAccToShelfs = collision(bullet, moveBullet.context, moveBullet.shelfs)[0];
        
        if (posAccToShelfs) {
               runBullet.socket.emit("bulletDestroy");
            bulletDestroyed.x=bullet.x;
            bulletDestroyed.y=bullet.y-10;
            helpers.temporalAnimations.addOne(bulletDestroyed);
            
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
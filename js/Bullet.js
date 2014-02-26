
define(["Rectangle","collision"], function(Rectangle,collision){
        
       

    function runBullet(x, y, bulletDirection) {

        if (runBullet.ui.bullet) {
            return runBullet.ui.bullet;
        }
    
        runBullet.bulletDirection = runBullet.ui.bulletDirection;
        runBullet.socket.emit("bulletFired", [x, y, runBullet.ui.bulletDirection]);
        var outBullet = new Rectangle(x, y + 5, 20, 10,
                                      "img:bullet", {right: 3, down: 0},
                                      runBullet.bulletDirection, 5);
        //outBullet.spriteDecorator.setReversible();
        //if (runBullet.bulletDirection==-1) {
        //    outBullet.spriteDecorator.setLeft();
        //}
            
        return outBullet;
    }


    function moveBullet(bullet) {
        var posAccToShelfs = collision(bullet, moveBullet.context, moveBullet.shelfs)[0];
    
        //var left=posAccToShelfs & 1;
        //var right=posAccToShelfs & 2;
        //var top= posAccToShelfs & 4;
        //var bottom=posAccToShelfs & 8;  
        if (posAccToShelfs) {
            runBullet.socket.emit("bulletDestroy");
            delete moveBullet.ui.bullet;
            moveBullet.ui.bullet = false;
      //  moveBullet.ui.bulletDirection=0;
            return;
        }
    
        runBullet.socket.emit("bulletMove", bullet.x);
        bullet.move(runBullet.bulletDirection * 3, 0);
        moveBullet.ui.bullet.draw(moveBullet.context);
    }


    return {runBullet: runBullet, moveBullet: moveBullet};

});
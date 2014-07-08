
define(['Rectangle','RectangleDecorator','collision','helpers','sounds','Ui'], function(Rectangle,RectangleDecorator,collision,helpers, sounds,Ui){
    var rectFactory=new helpers.rectangleFatory(),
    bulletDestroyed,
    rectDec,
    bulletFallingPhase=0;

    
    

        
    
    
    function runBullet(x, y, bulletDirection) {

        if (runBullet.ui.bullet) {
            return runBullet.ui.bullet;
        }
 //       bombFly.play();
        sounds.bombFly();
        bulletDestroyed=runBullet.ui.bulletDestroyed;
        rectDec=runBullet.ui.rectDec;
        var startModAccToPlayer=runBullet.ui.faceToLeft.now?-1:1;
        console.log(startModAccToPlayer);
        runBullet.bulletDirection = runBullet.ui.bulletDirection;
        runBullet.socket.emit("bulletFired", [x+startModAccToPlayer*10, y, runBullet.ui.bulletDirection]);

        rectFactory.setMovementParameters(3,0,5,runBullet.bulletDirection);
        var outB=rectFactory.create({x:x+startModAccToPlayer*10, y:y-5, w:20, h:10, img:"bullet"});
        return outB;
    }
    
    
        

    function moveBullet(bullet) {
                
        
        var posAccToCanvasShelfs = collision(bullet, moveBullet.context, moveBullet.shelfs)[0];
        
        if (posAccToCanvasShelfs) {
            runBullet.socket.emit("bulletDestroy");
            bulletDestroyed.x=bullet.x;
            bulletDestroyed.y=bullet.y-10;
            helpers.temporalAnimations.addOne(bulletDestroyed);
            bulletFallingPhase=0;
            delete moveBullet.ui.bullet;
//        explosionSound();
//        if(bulletFalling.length>1) {bullet.y+=100; bulletFalling.shift();};        

        sounds.explosion();      
        sounds.stopFlying();
        //setTimeout(function(){
        //            bombFly.pause();
        //bombFly.currentTime=0;
        //    },300);

//            bum.play();
            moveBullet.ui.bullet = false;


            return;
        }
    
        runBullet.socket.emit("bulletMove", {x:bullet.x,y:bullet.y});
        bullet.move(runBullet.bulletDirection * 3, Ui.bulletFalling[bulletFallingPhase]);
        if (bulletFallingPhase<Ui.bulletFalling.length-1) {
            bulletFallingPhase+=1;
        }
  
        moveBullet.ui.bullet.draw(moveBullet.context);
    }

    return {runBullet: runBullet, moveBullet: moveBullet};

});
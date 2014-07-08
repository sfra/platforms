
define(['Rectangle','RectangleDecorator','collision','helpers','sounds'], function(Rectangle,RectangleDecorator,collision,helpers, sounds){
    var rectFactory=new helpers.rectangleFatory(),
    bulletDestroyed,
    rectDec;
    
    //sounds={
    //
    //    explosion: function(){
    //            if (this.explosion.explosionNr===undefined || this.explosion.explosionNr>4) {
    //            this.explosion.explosionNr=0;
    //            };
    //            var bum=document.getElementById('bum'+this.explosion.explosionNr);
    //            bum.play();
    //            this.explosion.explosionNr+=1;            
    //    },
    //    flyingBombs:[],
    //    stopFlying: function(){
    //        var currentFly=this.flyingBombs.shift();
    //        setTimeout(function(){
    //            currentFly.pause();
    //            currentFly.currentTime=0;
    //        },300);
    //
    //    
    //    },
    //    bombFly: function(){
    //            if (this.bombFly.flyNr===undefined || this.bombFly.flyNr>1) {
    //            this.bombFly.flyNr=0;
    //            };
    //            var bombFly=document.getElementById('bombFly'+this.bombFly.flyNr);
    //            bombFly.play();
    //            this.flyingBombs.push(bombFly);
    //            this.bombFly.flyNr+=1;
    //    }
    //};

        
    
    
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
//        explosionSound();
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
    
        runBullet.socket.emit("bulletMove", bullet.x);
        bullet.move(runBullet.bulletDirection * 3, 0);
        moveBullet.ui.bullet.draw(moveBullet.context);
    }

    return {runBullet: runBullet, moveBullet: moveBullet};

});
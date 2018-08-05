define(['Ui', 'collision'], function (Ui, collision) {
    'use strict';
    return (
        function (data) {
            let collisions = collision(Ui.player, Ui.shelfs);
            let posAccToCanvasShelfs = collisions[0];
            
             
            let left = posAccToCanvasShelfs & 1;
            let right = posAccToCanvasShelfs & 2;
            let top = (posAccToCanvasShelfs & 4) | (posAccToCanvasShelfs & 16);
            let bottom = posAccToCanvasShelfs & 8;

            Ui.playerDirection = [0, 1];
            
            
            

            if (left) {
                Ui.left = false;
            };

            if (right) {
                Ui.right = false;
            };

            if (top) {
                Ui.up = false;
            };

            if (bottom) {
                Ui.down = true;
                Ui.playerDirection[1] = 0;
                Ui.player.jumpable = true;
            } else if (!Ui.player.jumpable) {
                Ui.playerDirection[1] = 1;
            } else {
                Ui.down = false;
            };

            if (Ui.left) {
                Ui.playerDirection[0] = -Ui.player.speed.right;
            };

            if (Ui.right) {
                Ui.playerDirection[0] = Ui.player.speed.right;
            };
            
            
            console.log('[[[[[[[[[[[[]]]]]]]]]]]]');
            console.log(Ui.playerDirection);
            
            if(collisions[2]!==null) {
            
                    Ui.playerDirection[0] = collisions[2];
                
            }
            
            
            

        }
    );

});
define(['Ui', 'collision'], function (Ui, collision) {
    'use strict';
    return (
            function (data) {
                var posAccToCanvasShelfs = collision(Ui.player, Ui.shelfs)[0];
                var left = posAccToCanvasShelfs & 1;
                var right = posAccToCanvasShelfs & 2;
                var top = (posAccToCanvasShelfs & 4) | (posAccToCanvasShelfs & 16);
                var bottom = posAccToCanvasShelfs & 8;

                Ui.playerDirection = [0, 1];

                if (left) {

                    Ui.left = false;
                }
                if (right) {

                    Ui.right = false;
                }

                if (top) {

                    Ui.up = false;
                }

                if (bottom) {
                    Ui.down = true;
                    Ui.playerDirection[1] = 0;
                    Ui.player.jumpable = true;
                } else if (!Ui.player.jumpable) {
                    Ui.playerDirection[1] = 1;


                } else {
                    Ui.down = false;

                }

                if (Ui.left) {
                    Ui.playerDirection[0] = -Ui.player.speed.right;
                }

                if (Ui.right) {
                    Ui.playerDirection[0] = Ui.player.speed.right;
                }

            }

    );

});
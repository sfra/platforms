define([], function () {


    return {

        explosion: function () {
            if (this.explosion.explosionNr === undefined ||
                this.explosion.explosionNr > 4) {
                this.explosion.explosionNr = 0;
            };
            var bum = document.getElementById('bum' + this.explosion.explosionNr);
            bum.play();
            this.explosion.explosionNr += 1;
        },

        flyingBombs: [],

        stopFlying: function () {
            var currentFly = this.flyingBombs.shift();
            setTimeout(function () {
                currentFly.pause();
                currentFly.currentTime = 0;
            }, 300);
        },

        bombFly: function () {
            if (this.bombFly.flyNr === undefined || this.bombFly.flyNr > 1) {
                this.bombFly.flyNr = 0;
            };
            var bombFly = document.getElementById('bombFly' + this.bombFly.flyNr);
            bombFly.play();
            this.flyingBombs.push(bombFly);
            this.bombFly.flyNr += 1;
        }

    };



});
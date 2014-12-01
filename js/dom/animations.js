define([], function () {
    var shakedElement = document.getElementById('cnv');
    function oneMove(times) {
        if (times === 0) {
            shakedElement.style.left='40px';
            return;
        }
        if (times % 2 === 0) {
            shakedElement.style.left  ='50px';
        } else {
            shakedElement.style.left = '30px';
        };

        setTimeout(function (){
            oneMove(times-1);
        },20);

    };



    return {
        shake: function () {

            oneMove(10);



        }

    };

});
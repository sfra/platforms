requirejs.config({
                 baseUrl: "js",

                 paths:{
                  "jquery":[
                  "http://code.jquery.com/jquery-2.1.0.min",
                  "../libs/jquery-2.1.0.min"
                    ],
                  "socketio":[
                    "../libs/socket.io"
                  ],
                  "Bullet":["classes/Bullet"],
                  "Rectangle":["classes/Rectangle"],
                  "Sprite" : ["classes/Sprite"],
                  "SpriteDecorator":["classes/SpriteDecorator"]
                    
                  }
                 
                 
                 
});

requirejs.onError = function (err) {
    console.log(err.requireType);
    console.log('modules: ' + err.requireModules);
    throw err;
};

//requirejs.onError = function (err) {
//    if (err.requireType === 'timeout') {
//        // tell user
//        alert("error: "+err);
//    } else {
//        console.log(err);
//    }
//};

require(["main"],function(){
                 });
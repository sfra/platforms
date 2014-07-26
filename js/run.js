requirejs.config({
                 baseUrl: 'js',

                 paths:{
                  'jquery':[
                  '../node_modules/jquery/dist/jquery.min',
                  'http://code.jquery.com/jquery-2.1.0.min'                  
                    ],
                  'socketio':[
                    '../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io'
                  ],
                  'Bullet':['classes/Bullet'],
                  'Rectangle':['classes/Rectangle'],
                  'RectangleDecorator' : ['classes/RectangleDecorator'],
                  'Sprite' : ['classes/Sprite'],
                  'SpriteDecorator':['classes/SpriteDecorator'],
                  'RectangleDecoratorPattern' : ['classes/RectangleDecoratorPattern']
                    
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
//        alert('error: '+err);
//    } else {
//        console.log(err);
//    }
//};

require(['main','keyboardManager','socketManager'],function(){
                 });
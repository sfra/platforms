"use strict";

define(["Sprite"],function(Sprite){
    
    
    var  SpriteDecorator=function(sprt){
        var _sprt=sprt;
        
        
        this.setReversible=function(){
            _sprt.isReversible=true;
            _sprt.setImages(true);
          
        }
        
        //this.setLeft=function(){
        //        _sprt.left=true;
        //};
            
        
        this.setLeft=function(){
                _sprt.left=true;
            };
        
        this.changeDirection=function(){
                if (_sprt.left!=undefined ) {
                    _sprt.left=!_sprt.left;
                }
        };
            
            
            
            
        
    }
    
    
    return SpriteDecorator;






});
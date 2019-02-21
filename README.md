# Platforms game.
![platform](https://user-images.githubusercontent.com/4636028/53198209-1cb32f00-361c-11e9-8d03-1986e918184a.gif)


This is a simple demo of animations using canvas and socket.io libs. It do not use any external libraries for supporting any relevant game component (graphics, game physics).

Watch and listen on [vimeo](https://vimeo.com/318857033)

## Build
```bash
npm install
```
If you don't have http-server, just install it

## Run 
```bash
npm run start
```

Then two different browsers (if you have installed at least two), will open and you can start to play with yourself.


## Alternative run 
If you have any problems (you are using windows, for example :)), try



```bash
node server/server.js
```

```bash
http-server
```
In two different terminals.
  
Open http://0.0.0.0:8080 in two different browsers.
Use arrow keys to move your square, hold shift for turbo move, space for jump and
z for shot. Red square represents your "opponent".



In this game sprite from the page  [gameart2d.com](https://www.gameart2d.com/cute-girl-free-sprites.html) has been used.

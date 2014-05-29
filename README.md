This is a simple demo of animations using canvas and socket.io libs. Copy socket.io.js file into
libs directory (instructions contained in libs/README.txt).

Then run
```bash
node server/server.js
```
from console and open index.html in two different browsers.
Use arrow keys to move your square, hold shift for turbo move, space for jump and
z for shot. Red square represents your "opponent".

According to the fact that the server does not work with the latest socket.io, the best way to run the game is to install the version 0.9.16 locally. Just type
in the main directory:

```bash
npm install socket.io@0.9.16
```

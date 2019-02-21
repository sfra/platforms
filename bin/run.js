const childProcess = require('child_process');
const spawn = require('child_process').spawn;

const opn = require('opn');
let socketServer = childProcess.exec('node server/server.js', (error, stdout, stderr)=> {
   if (error) {
     console.log(error.stack);
     console.log('Error code: '+error.code);
     console.log('Signal received: '+error.signal);
   }
   console.log('Child Process STDOUT: '+stdout);
   console.log('Child Process STDERR: '+stderr);
 });

 socketServer.on('exit', (code)=> {
   console.log('Child process exited with exit code '+code);
 });


let httpServer = childProcess.exec('http-server', (error, stdout, stderr)=> {
   if (error) {
     console.log(error.stack);
     console.log('Error code: '+error.code);
     console.log('Signal received: '+error.signal);
   }
   console.log('Child Process STDOUT: '+stdout);
   console.log('Child Process STDERR: '+stderr);
 });

 httpServer.on('exit', (code)=> {
   console.log('Child process exited with exit code '+code);
 });



let open = spawn('apropos', ['browser']);

open.stdout.on('data', function (data) {
  let browsers = [];
  let lines = data.toString().split('\n');
  for (let i = 0, max = lines.length; i < max; i++) {

    !lines[i].match(/firefox|chrome/) || browsers.push(
      lines[i].replace(/^(\S*)\s.*$/, (match, group) => {
        return group;
      })


    );

  }

  opn('http://localhost:8080', {app: browsers[0]}).then(() => {
    // image viewer closed
  });
  opn('http://localhost:8080', {app: browsers[1] ||browsers[1] }).then(() => {
    // image viewer closed
  });




});

open.stderr.on('data', function (data) {
  console.log('stderr: ' + data.toString());
});

open.on('exit', function (code) {
  console.log('child process exited with code ' + code.toString());
});

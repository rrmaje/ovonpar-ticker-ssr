import http from 'http';
var fs = require('fs')
var https = require('https')

let app = require('./server').default;

/*
const server = https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
}, app);
*/
const server = http.createServer(app);

let currentApp = app;


server.listen(process.env.PORT || 3000, error => {
  if (error) {
    console.log(error);
  }

  console.log('started');
});

if (module.hot) {
  console.log('Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('HMR Reloading `./server`...');

    try {
      app = require('./server').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}

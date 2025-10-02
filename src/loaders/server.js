const
  express = require('express'),
  app = express();

function createServerApp() {

  // Avoid cache by default (header can be overwritten later on)
  app.use((req, res, next) => (res.setHeader('Cache-Control', 'private, no-cache'), next()));

  // CORS, helmet, ...
  app.use(require('../middlewares/security.js'));
  
  app.use(express.json(), (err, req, res, next) => err ? next('Invalid JSON') : next());

  // For more information about Express' urlencoded middleware, see: http://expressjs.com/en/5x/api.html#express.urlencoded
  app.use(express.urlencoded({ extended: true }));

  // plug response hooks
  app.use(require('express-response-hooks')());

  // auth middleware (must be before the route initialization)
  // app.use(passport.initialize());

  // plug the routes
  app.use('/', require('./routes.js'));

  // must be last as a "catch-all" error handler
  app.use(require('../middlewares/global-request-error-handler.js'));

  return app;

}

async function startServer() {
  
  const useHttps = (process.env.USE_HTTPS_SERVER === '1');
  const server = useHttps ? require('https') : require('http');
  
  const options = require('./ssl-express-loader.js');

  const host = process.env.SERVER_LISTEN_HOST || '127.0.0.1';
  const port = process.env.PORT || 8092;
  server.createServer(options, app).listen({ host, port }, function () {
    console.log(`server listens on port ${useHttps ? 'https' : 'http'}://${host}:${port}`);
  });

  console.info('- 🚀 web server started!');
}

async function init() {
  createServerApp();
  await startServer();
}

module.exports = {
  init
};

if (process.env.NODE_ENV === 'test') {
  Object.assign(module.exports, {
    createServerApp
  });
}
const apiRouter = require('express').Router();

/////////////////////////////
// Partially cached routes //
/////////////////////////////

apiRouter.use('/items', require('../routes/example.js'));
// apiRouter.use('/profile', require('./profile.js'));

///////////////////////////////////////////////////////////////////////////////////////////
// Fully cached routes                                                                   //
// All the requests and responses after the next line might be cached on a CDN.          //
// !!! Don't use endpoints with sensitive data or user related data after this line. !!! //
///////////////////////////////////////////////////////////////////////////////////////////
apiRouter.use(require('../middlewares/cache-control-headers.js'));

// apiRouter.use('/sitemap', require('./sitemap.js'));

////////////////////////////////////////////////////

const router = require('express').Router();

router.use('/v1', apiRouter);
router.get('/', (_, res) => res.send('OK'));

module.exports = router;

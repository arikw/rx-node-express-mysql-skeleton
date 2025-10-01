const
  chai = require('chai'),
  dbHelpers = require('../helpers/db.js'),
  { default: chaiHttp, request: chaiHttpRequest } = require('chai-http'),
  express = require('express'),
  mock = require('mock-require'),
  app = express(),
  decache = require('decache'),
  
  { expect } = chai;

chai.use(chaiHttp);

const request = () => chaiHttpRequest.execute(app);

let db = null;

describe('routes/example.js', () => {

  before(async () => {

    db = require('../../src/db/db.js');
    await db.init({
      testMode: true
    });

    mock('../../src/middlewares/auth.js', {
      ensureAuthenticated: (req, res, next) => {
        req.user = {
          name: 'Me',
          email: 'me@example.com',
          picture: 'https://example.com/me.jpg'
        };
        next();
      }
    });

    app.use(express.json());

    const router = require('../../src/routes/example.js');
    app.use('/items', router);

  });

  after(() => {
    db.clearAll();
    db = null;
    mock.stopAll();
    decache('../../src/db/db.js');
    decache('../../src/middlewares/auth.js');
  });

  it('POST /items rejects empty request', async () => {

    const res = await request()
      .post('/items')
      .send({});
    
    expect(res.status).to.be.equal(400);
    expect(res.body.details.missing?.length).to.be.equal(2);
    expect(res.body.details.missing).to.include('parentItemId');
    expect(res.body.details.missing).to.include('anotherProperty');

  });

  it('POST /items rejects invalid request', async () => {

    const res = await request()
      .post('/items')
      .send({
        parentItemId: 'invalid-parent-id-which-is-way-too-long-1234567890',
        anotherProperty: ''
      });
    
    expect(res.status).to.be.equal(400);
    expect(res.body.details.length).to.be.equal(2);
    expect(res.body.details[0].msg).to.be.equal('too long');
    expect(res.body.details[1].msg).to.be.equal('Wrong value');

  });

  it('POST /items accepts valid requests', async () => {
    
    db.setResultsByMatch([
      { regex: /.*/, result: [{}] }
    ]);

    const res = await request()
      .post('/items/new')
      .send({
        uid: 'abcdef123456',
        translations: {
          'en-US': { label: 'hello', text: 'Hello text' },
          'he-IL': { label: 'שלום', text: 'טקסט בעברית' }
        }
      });
    
    expect(res.status, `${JSON.stringify(res.body)}`).to.be.equal(200);
    expect(dbHelpers.normalizeQuery(db.getLastQuery()), 'got unexpected db query').to.be.equal(dbHelpers.getQueryFromFile('integration/data/queries/manage/example.sql'));
  });
});

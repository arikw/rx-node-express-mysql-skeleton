const router = require('express').Router();
const { body, param } = require('express-validator');
const { strictValidationMW } = require('../common/request-validation.js');
const { ensureAuthenticated } = require('../middlewares/auth.js');
const controller = require('../controllers/example.js');
const { hasOnlyAllowedKeys } = require('../utils/object.js');

const MAX_ID_LENGTH = 45;
const MAX_PARENT_UID_LENGTH = 8;

router.get('/:itemId',
  strictValidationMW(
    param('itemId').notEmpty().isString().isLength({ max: MAX_ID_LENGTH }).matches(/^[a-f0-9]+$/).withMessage('Invalid value')
  ),
  controller.getItem);

// ##########################################################
//        Protected routes - require authentication
// ##########################################################

router.use(ensureAuthenticated);

router.post('/',
  strictValidationMW(
    body('parentItemId', 'Invalid parentItemId').notEmpty().isString().isLength({ max: MAX_PARENT_UID_LENGTH }).withMessage('too long').bail().matches(/^[a-f0-9]+$/).withMessage('Invalid value'),
    body('anotherProperty', 'Wrong value').notEmpty().isLength({ max: 128 }).withMessage('Invalid value!. Name must not exceed 128 characters')
  ),
  controller.addItem);

router.post('/new',
  strictValidationMW(
    body('uid').not().isEmpty().bail().isString(),
    // eslint-disable-next-line security/detect-unsafe-regex
    body('translations').isObject().custom(o => hasOnlyAllowedKeys(o, (k) => /^[a-z]{2}(\-[A-Z]{2})?$/.test(k))).withMessage('Illegal translations'),
    body('translations.*').isObject().custom(o => hasOnlyAllowedKeys(o, ['label', 'text'])).withMessage('Illegal translation props').optional({ nullable: true }),
    body('translations.*.label').isString().optional({ nullable: true }),
    body('translations.*.text').isString().optional({ nullable: true })
  ),
  controller.addItem);

module.exports = router;
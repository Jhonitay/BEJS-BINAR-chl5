const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/accountControllers'),
    // checkToken = require('../middleware/checkToken'),
    validate = require('../middleware/validate'),
    schema = require('../validatorSchemas/accountValidatorSchema.js')

router.post('/accounts' ,validate(schema.addAccount),controller.addAccount)
router.get('/accounts', controller.getAccount)
router.get('/accounts/:Id', controller.getDetailAccount)
router.patch('/accounts/:Id', validate(schema.updateAccount),controller.updateAccount)
router.delete('/accounts/:Id', controller.delateAccount)

module.exports = router
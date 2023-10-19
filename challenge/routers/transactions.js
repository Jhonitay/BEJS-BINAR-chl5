const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/transactionController'),
    checkToken = require('../middleware/checkToken'),
    validate = require('../middleware/validate'),
    schema = require('../validatorSchemas/transactionValidatorSchema.js')

router.post('/transactions',checkToken, validate(schema.addTransaction),controller.TransactionAccount)
router.get('/transactions', controller.getTransactions)
router.get('/transactions/:Id', controller.getDetailTransactions)
router.patch('/transactions/:Id', validate(schema.updateTransaction),controller.updateTransaction)
router.delete('/transactions/:Id', controller.deleteTransaction)

module.exports = router
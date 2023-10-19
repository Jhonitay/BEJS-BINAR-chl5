const express = require('express'),
    router = express.Router(),
    authRouter = require('./auth'),
    accountRouter = require('./account'),
    transactionRouter = require('./transactions')

router.use('/auth',authRouter)
router.use('/auth',accountRouter)
router.use('/auth',transactionRouter)

module.exports = router
const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/userControllers'),
    validate = require('../middleware/validate'),
    schema = require('../validatorSchemas/authValidatorSchema.js'),
    checkToken = require('../middleware/checkToken')

router.post('/register',validate(schema.register), controller.registerUser)
router.get('/users', controller.getUsers)
router.get('/users/:userId', controller.getUserDetails)
router.patch('/users/:userId', controller.updateUser)
router.delete('/users/:userId', controller.deleteUser)
router.post('/users/login', validate(schema.login),controller.loginUser)
router.post('/authenticate', checkToken, controller.getProfile)

module.exports = router

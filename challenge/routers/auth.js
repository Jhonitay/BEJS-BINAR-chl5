const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/userControllers'),
    validate = require('../middleware/validate'),
    schema = require('../validatorSchemas/authValidatorSchema.js'),
    checkToken = require('../middleware/checkToken')

router.post('/register',validate(schema.register), controller.registerUser)
router.post('/login', validate(schema.login),controller.loginUser)
router.post('/authenticate', checkToken, controller.getProfile)
router.delete('/users',checkToken, controller.deleteMyUser)
router.patch('/users', checkToken,validate(schema.changePassword), controller.changePasswordUser)
router.get('/users', controller.getUsers)
router.get('/users/:userId', controller.getUserDetails)

module.exports = router

const {body} = require('express-validator')

const register = [
    body('name').notEmpty(),
    body('email').notEmpty().isEmail(),
    body('password').notEmpty(),
    body('identity_type').notEmpty(),
    body('identity_number').notEmpty(),
    body('address').notEmpty()
]

const login = [
    body('email').notEmpty().isEmail(),
    body('password').notEmpty()
]

const changePassword = [
    body('oldEmail').notEmpty().isEmail(),
    body('oldPassword').notEmpty(),
    body('Email').notEmpty().isEmail(),
    body('Password').notEmpty()
]

module.exports = {
    register,
    login,
    changePassword
}
const {body} = require('express-validator')

const addAccount = [
    body('user_id').notEmpty().isNumeric(),
    body('bank_name').notEmpty(),
    body('bank_account_number').notEmpty().isNumeric(),,
    body('balance').notEmpty().isNumeric(),
]

const updateAccount =[
    body('bank_account_number').notEmpty().isNumeric(),,
    body('balance').notEmpty().isNumeric(),
]

module.exports ={
    addAccount,
    updateAccount
}
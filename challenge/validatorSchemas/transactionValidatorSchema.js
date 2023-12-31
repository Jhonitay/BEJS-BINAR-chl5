const {body} = require('express-validator')

const addTransaction = [
    body('source_account_number').notEmpty().isNumeric(),
    body('destination_account_number').notEmpty().isNumeric(),
    body('amount').notEmpty().isNumeric(),
    
]

const updateTransaction =[
    body('id').notEmpty().isNumeric(),,
    body('balance').notEmpty().isNumeric(),
]

module.exports ={
    addTransaction,
    updateTransaction
}
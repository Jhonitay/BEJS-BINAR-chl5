const express = require('express')
const router = express.Router()
const userController = require('./controllers/userControllers')
const accountControllers = require('./controllers/accountControllers')
const transactionController = require('./controllers/transactionController')

router.get('/',(req,res)=>{
    return res.json({
        message: "hay bro"
    })
})

router.post('/users', userController.registerUser)
router.get('/users', userController.getUsers)
router.get('/users/:userId', userController.getUserDetails)
router.patch('/users/:userId', userController.updateUser)
router.delete('/users/:userId', userController.deleteUser)

router.post('/accounts', accountControllers.addAccount)
router.get('/accounts', accountControllers.getAccount)
router.get('/accounts/:accountId', accountControllers.getDetailAccount)

router.post('/transactions', transactionController.TransactionAccount)
router.get('/transactions', transactionController.getTransactions)
router.get('/transactions/:transactions', transactionController.getDetailTransactions)


module.exports = router
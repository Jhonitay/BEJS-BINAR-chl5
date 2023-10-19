// const express = require('express')
// const router = express.Router()
// const userController = require('../controllers/userControllers')
// const accountControllers = require('../controllers/accountControllers')
// const transactionController = require('../controllers/transactionController')
// const checkToken = require('../middleware/checkToken')


// router.post('/users', userController.registerUser)
// router.get('/users', userController.getUsers)
// router.get('/users/:userId', userController.getUserDetails)
// router.patch('/users/:userId', userController.updateUser)
// router.delete('/users/:userId', userController.deleteUser)
// router.post('/users/login', userController.loginUser)
// router.post('/users/auth/authenticate', checkToken, userController.getProfile)


// router.post('/accounts', accountControllers.addAccount)
// router.get('/accounts', accountControllers.getAccount)
// router.get('/accounts/:Id', accountControllers.getDetailAccount)
// router.patch('/accounts/:Id', accountControllers.updateAccount)
// router.delete('/accounts/:Id', accountControllers.delateAccount)

// router.post('/transactions', transactionController.TransactionAccount)
// router.get('/transactions', transactionController.getTransactions)
// router.get('/transactions/:Id', transactionController.getDetailTransactions)
// router.patch('/transactions/:Id', transactionController.updateTransaction)
// router.delete('/transactions/:Id', transactionController.deleteTransaction)


// module.exports = router
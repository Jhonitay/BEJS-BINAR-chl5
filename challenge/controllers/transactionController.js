// Import PrismaClient
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller function to perform a transaction
module.exports = {
  TransactionAccount: async (req, res) => {
    try {
      const {  source_account_number ,destination_account_number, amount } = req.body;

      const checkAccount = await prisma.bank_accounts.findFirst({
        where : {
          bank_account_number : source_account_number
        }
      })
      if (checkAccount) {
        if(checkAccount.user_id != res.user.id){
          return res.status(409).json({
            error: 'there is not your account number',
          });
        }
      } else {
        return res.status(404).json({
          error: 'account number not found',
        });
      }
      // Retrieve source and destination accounts
      const sourceAccount = await prisma.bank_accounts.findFirst({
        where: { bank_account_number: source_account_number },
      });

      const destinationAccount = await prisma.bank_accounts.findFirst({
        where: { bank_account_number: destination_account_number },
      });

      // Check if accounts exist
      if (!sourceAccount || !destinationAccount) {
        return res.status(404).json({
          error: 'Source or destination account not found',
        });
      }

      if (source_account_number === destination_account_number) {
        return res.status(403).json({
          error: "cannot perform transactions to the same account",
        });
      }

      // Check if source account has sufficient balance
      if (sourceAccount.balance < amount) {
        return res.status(403).json({
          error: "Insufficient balance in the source account",
        });
      }

      // Perform the transaction
      await prisma.$transaction([
        prisma.bank_account_transactions.create({
          data: {
            source_account_id:sourceAccount.id,
            destination_account_id:destinationAccount.id,
            amount,
          },
        }),
        prisma.bank_accounts.update({
          where: { id: sourceAccount.id },
          data: {
            balance: {
              decrement: amount,
            },
          },
        }),
        prisma.bank_accounts.update({
          where: { id: destinationAccount.id },
          data: {
            balance: {
              increment: amount,
            },
          },
        }),
      ]);

      return res.status(200).json({
        message: 'Transaction successful',
      });
    } catch (error) {
      console.error('Error performing transaction:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },

  getTransactions: async (req, res) => {
    try {
      // Retrieve the list of transactions
      const transactions = await prisma.bank_account_transactions.findMany({
        // include: {
        //   source_account: true,
        //   destination_account: true,
        // },
      });

      const serializedTransactions = JSON.parse(JSON.stringify(transactions, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
        ));

      // Return the list of transactions in the response
      return res.json({
        data: serializedTransactions,
      });
    } catch (error) {
      console.error('Error getting transactions:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },

  getDetailTransactions: async (req, res) => {
    const Id = parseInt(req.params.Id, 10);
    try {
      // Retrieve the list of transactions
      const transactions = await prisma.bank_account_transactions.findUnique({
        where: {
            id: Id,
          },
        include: {
          source_account: true,
          destination_account: true,
        },
      });

      const serializedTransactions = JSON.parse(JSON.stringify(transactions, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
        ));

      // Return the list of transactions in the response
      return res.status(200).json({
        data: serializedTransactions,
      });
    } catch (error) {
      console.error('Error getting transactions:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },

  deleteTransaction: async(req,res) => {
    const transactionsId = parseInt(req.params.Id, 10);

    try {
      const transaction = await prisma.bank_account_transactions.findUnique({
        where:{
          id : transactionsId
        }
      })
      if(!transaction){
        return res.status(404).json({
          message : "id transaction not found"
        })
      }
      await prisma.bank_account_transactions.delete({
        where: { id: transactionsId },
      });

      return res.json({
        message: "transaction deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },

  updateTransaction: async (req, res) => {
    const Id = parseInt(req.params.Id, 10);
    const { amount } = req.body;

    try {
      const updatedTransactoin = await prisma.bank_account_transactions.update({
        where: { id: Id },
        data:  {amount},
      });

      const accountTransactions = await prisma.bank_account_transactions.findUnique({
        where: {
          id: Id,
        },
      });
      const source_account = accountTransactions.source_account_id
      const destination_account = accountTransactions.destination_account_id
      const sourceAmount = await prisma.bank_accounts.findUnique({
        where: {
          id: source_account,
        },
      });

      if (sourceAmount.balance < amount) {
        return res.status(400).json({
          error: 'Insufficient balance in the source account',
        });
      }

      // Perform the transaction
      await prisma.$transaction([
        prisma.bank_accounts.update({
          where: { id: source_account },
          data: {
            balance: {
              decrement: amount,
            },
          },
        }),
        prisma.bank_accounts.update({
          where: { id: destination_account },
          data: {
            balance: {
              increment: amount,
            },
          },
        }),
      ]);

      const serializedTransactions = JSON.parse(JSON.stringify(updatedTransactoin, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
        ));

      return res.json({
        data: serializedTransactions,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },
};

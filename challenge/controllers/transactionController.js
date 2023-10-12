// Import PrismaClient
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller function to perform a transaction
module.exports = {
  TransactionAccount: async (req, res) => {
    try {
      const { source_account_id, destination_account_id, amount } = req.body;

      // Retrieve source and destination accounts
      const sourceAccount = await prisma.bank_accounts.findUnique({
        where: { id: source_account_id },
      });

      const destinationAccount = await prisma.bank_accounts.findUnique({
        where: { id: destination_account_id },
      });

      // Check if accounts exist
      if (!sourceAccount || !destinationAccount) {
        return res.status(404).json({
          error: 'Source or destination account not found',
        });
      }

      if (source_account_id === destination_account_id) {
        return res.status(404).json({
          error: 'cannot perform transactions to the same account',
        });
      }

      // Check if source account has sufficient balance
      if (sourceAccount.balance < amount) {
        return res.status(400).json({
          error: 'Insufficient balance in the source account',
        });
      }

      // Perform the transaction
      await prisma.$transaction([
        prisma.bank_account_transactions.create({
          data: {
            source_account_id,
            destination_account_id,
            amount,
          },
        }),
        prisma.bank_accounts.update({
          where: { id: source_account_id },
          data: {
            balance: {
              decrement: amount,
            },
          },
        }),
        prisma.bank_accounts.update({
          where: { id: destination_account_id },
          data: {
            balance: {
              increment: amount,
            },
          },
        }),
      ]);

      return res.json({
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
    const idTransactions = parseInt(req.params.transactions, 10);
    try {
      // Retrieve the list of transactions
      const transactions = await prisma.bank_account_transactions.findUnique({
        where: {
            id: idTransactions,
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
};

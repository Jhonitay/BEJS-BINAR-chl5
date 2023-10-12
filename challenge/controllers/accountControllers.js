// Import PrismaClient
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller function to add a new account to a registered user
module.exports = {
  addAccount: async (req, res) => {

    try {
      // Check if the user exists
      const user = await prisma.users.findUnique({
        where: {
          id: req.body.user_id,
        },
      });

      if (!user) {
        return res.status(404).json({
          error: 'User not found',
        });
      }

      // Create a new bank account for the user
      const newAccount = await prisma.bank_accounts.create({
        data: {
          bank_name: req.body.bank_name,
          bank_account_number: req.body.bank_account_number,
          balance: req.body.balance,
          user: {
            connect: {
              id: req.body.user_id,
            },
          },
        },
      });

      const serializedAccount = JSON.parse(JSON.stringify(newAccount, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
        ));

      // Return the newly created account in the response
      return res.json({
        data: serializedAccount,
      });
    } catch (error) {
      console.error('Error adding account:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  },


  getAccount: async (req, res) => {
    try {
    const account = await prisma.bank_accounts.findMany();

    const detailAccount = account.map(account => {
      return{
        bank_name : account.bank_name,
        bank_account_number : account.bank_account_number
      }
    })

    return res.json({
        data : detailAccount,
    });

    } catch (error) {
    
        console.error('Error getting account names:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
    
  },

  getDetailAccount: async (req,res) => {
    const accountId = parseInt(req.params.accountId, 10);
    try {
        const bankAccount = await prisma.bank_accounts.findUnique({
            where: {
              id: accountId,
            },
          });
          if (!bankAccount) {
            return res.status(404).json({
              error: "account not found",
            });
          }

          const serializedAccount = JSON.parse(JSON.stringify(bankAccount, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
        ));

          return res.json({
            data : serializedAccount,
          })
    } catch (error) {
        
        console.error('Error getting account names:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  }
};

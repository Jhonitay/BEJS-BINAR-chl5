// Import PrismaClient
const { PrismaClient } = require("@prisma/client");
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
          error: "User not found",
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

      const serializedAccount = JSON.parse(
        JSON.stringify(newAccount, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      // Return the newly created account in the response
      return res.status(200).json({
        data: serializedAccount,
      });
    } catch (error) {
      console.error("Error adding account:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },

  getAccount: async (req, res) => {
    try {
      const account = await prisma.bank_accounts.findMany();

      const detailAccount = account.map((account) => {
        return {
          bank_name: account.bank_name,
          bank_account_number: account.bank_account_number,
        };
      });
      return res.status(200).json({
        data: detailAccount,
      });
    } catch (error) {
      console.error("Error getting account names:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },

  getDetailAccount: async (req, res) => {
    const Id = parseInt(req.params.Id, 10);
    try {
      const bankAccount = await prisma.bank_accounts.findUnique({
        where: {
          id: Id,
        },
      });
      if (!bankAccount) {
        return res.status(404).json({
          error: "account not found",
        });
      }

      const serializedAccount = JSON.parse(
        JSON.stringify(bankAccount, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      return res.json({
        data: serializedAccount,
      });
    } catch (error) {
      console.error("Error getting account names:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },

  updateAccount: async (req, res) => {
    const Id = parseInt(req.params.Id, 10);
    const { bank_account_number, balance } = req.body;

    try {
      const AccountUpdate = await prisma.bank_accounts.update({
        where: { id: Id },
        data: { bank_account_number, balance },
      });

      if(!AccountUpdate){
        return res.status(404).json({
          message : "id Not Found"
        })
      }

      const serializedAccount = JSON.parse(
        JSON.stringify(AccountUpdate, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      return res.status(200).json({
        message: "update succses",
        data: serializedAccount,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },

  delateAccount: async (req, res) => {
    const Id = parseInt(req.params.Id, 10);
    try {
      if (Id) {
        const getTransactions = await prisma.bank_account_transactions.findMany(
          {
            where: {
              OR: [
                {
                  source_account_id: Id,
                },
                {
                  destination_account_id: Id,
                },
              ],
            },
          }
        );
        if (getTransactions) {
          const getTransactionsId = getTransactions.map((getTransactions) => {
            return {
              id: getTransactions.id,
            };
          });

          //convert object to int
          const IntGetTransactinId = getTransactionsId.map((obj) => obj.id);
          await prisma.bank_account_transactions.deleteMany({
            where: {
              id: {
                in: IntGetTransactinId,
              },
            },
          });
        }
        // delete Bank Account
        await prisma.bank_accounts.delete({
          where: { id: Id },
        });
        return res.status(200).json({
          message: "delate succses",
        });
      } else {
        return res.status(404).json({
          message: "Id Not Found",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },
};

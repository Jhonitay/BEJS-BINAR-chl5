const { PrismaClient, Prisma } = require("@prisma/client"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken"),
  prisma = new PrismaClient(),
  utils = require('../utils')

module.exports = {
  registerUser: async (req, res) => {
    try {
      const existEmail = await prisma.users.findFirst({
        where:{
          email : req.body.email
        }
      })
      if(existEmail){
        return res.status(409).json({
          message : "email alredy exist"
        })
      }
      const existIdentity = await prisma.profile.findFirst({
        where:{
          identity_number : req.body.identity_number
        }
      })
      if(existIdentity){
        return res.status(409).json({
          message : "identity alredy exist"
        })
      }
      const user = await prisma.users.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          password: await utils.cryptPassword(req.body.password),
          profile: {
            create: {
              identity_number: req.body.identity_number,
              identity_type: req.body.identity_type,
              address: req.body.address,
            },
          },
        },
      });
      return res.status(201).json({
        message: "succsess create user",
        data: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "internal Server Error"
      });
    }
  },

  getUsers: async (req, res) => {
    try {
      // Query all users from the database
      const users = await prisma.users.findMany();

      // Return the list of users in the response
      return res.json({
        data: users,
      });
    } catch (error) {
      console.error("Error retrieving users:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },

  getUserDetails: async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    try {
      const user = await prisma.users.findUnique({
        where: {
          id: userId,
        },
        include: {
          profile: true,
        },
      });
      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }
      return res.json({
        data: user,
      });
    } catch (error) {
      console.error("Error retrieving user details:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },

  changePasswordUser: async (req, res) => {
    const { old_password, new_password } = req.body;
    const Id = res.user.id;

    try {
      const User = await prisma.users.findFirst({
        where: {
          id: Id
        }
      });

      if(bcrypt.compareSync(old_password, User.password)){
        const password = await utils.cryptPassword(new_password) 
        const updatedUser = await prisma.users.update({
          where: { id: Id },
          data: { password },
        });
  
        return res.status(200).json({
          data: updatedUser,
        });
      }else{
        return res.status(409).json({
          error: "invalid password",
        });
      }
      
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },

  deleteMyUser: async (req, res) => {
    // const userId = parseInt(req.params.userId, 10);
    const userId = res.user.id
    try {
      const user = await prisma.users.findFirst({
        where: {
          id: userId
        }
      });
      if (!user) {
        return res.status(404).json({
          message: "user id not found",
        });
      }
      
      if(bcrypt.compareSync(req.body.password, user.password)){
        const account = await prisma.bank_accounts.findMany({
          where: {
            user_id: userId,
          },
        });
  
        // delete Transaction
        if (account) {
          const getAccountId = account.map((account) => {
            return {
              id: account.id,
            };
          });
          //convert object to int
          const IntGetAccountId = getAccountId.map((obj) => obj.id);
          const getTransactions = await prisma.bank_account_transactions.findMany(
            {
              where: {
                OR: [
                  {
                    source_account_id: {
                      in: IntGetAccountId,
                    },
                  },
                  {
                    destination_account_id: {
                      in: IntGetAccountId,
                    },
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
          await prisma.bank_accounts.deleteMany({
            where: { user_id: userId },
          });
        }
        //delete profile
        await prisma.profile.delete({
          where: { user_id: userId },
        });
        //delete users
        await prisma.users.delete({
          where: { id: userId },
        });
  
        return res.status(200).json({
          message: "User deleted successfully",
        });
      }else{
        return res.status(409).json({
          message: "Invalid Password",
        });
      }
      
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({
        data : req.body.password,
      });
    }
  },

  loginUser: async (req, res) => {
    try {
      const findUser = await prisma.users.findFirst({
        where: {
          email: req.body.email,
        },
      });
      if (!findUser) {
        return res.status(404).json({
          error: "User Not Exists",
        });
      }
      if (bcrypt.compareSync(req.body.password, findUser.password)) {
        const token = jwt.sign({ id: findUser.id }, "secret_key", {
          expiresIn: "6h",
        });

        return res.status(200).json({
          data: {
            token,
          },
        });
      }

      return res.status(403).json({
        error: "invalid password",
      });
    } catch (error) {
      console.error(error)
      return res.status(403).json({
        error: "internal server error",
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      const users = await prisma.users.findUnique({
        where: {
          id: res.user.id,
        },
      });
  
      return res.status(200).json({
        data: users,
      });
    } catch (error) {
      console.error(error)
      return res.status(403).json({
        error: "internal server error",
      });
    }
  },
};

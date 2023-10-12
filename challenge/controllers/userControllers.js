const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  registerUser: async (req, res) => {
    const user = await prisma.users.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        profile: {
          create: {
            identity_number: req.body.identity_number,
            identity_type: req.body.identity_type,
            address: req.body.address,
          },
        },
      },
    });
    return res.json({
      data: user,
    });
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
      console.error('Error retrieving users:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
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
};

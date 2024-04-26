const { AppError } = require("../../shared/AppError");
const balancesService = require("./balance.service");

/**
 * Deposits money into the balance of a client,
 * a client can't deposit more than 25% his total of jobs
 * to pay. (at the deposit moment)
 */
async function deposit(req, res) {
  const { Contract, Job, Profile } = req.app.get("models");
  const sequelize = req.app.get("sequelize");
  const { amount } = req.body;
  const { userId } = req.params;
  const profile = req.profile;

  try {
    if (profile.id == userId) {
      throw new AppError("You need a different account to deposit", 400);
    }

    if (!amount) {
      throw new AppError("You need to provide a deposit amount", 400);
    }

    const client = await balancesService.depositBalance({
      profile,
      userId,
      amount,
      sequelize,
      Contract,
      Job,
      Profile,
    });

    res.json(client);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message }).end();
  }
}

module.exports = { deposit };

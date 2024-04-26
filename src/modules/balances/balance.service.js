const { Op } = require("sequelize");
const { AppError } = require("../../shared/AppError");

async function depositBalance({
  profile: { id: profileId },
  userId,
  amount,
  sequelize,
  Contract,
  Job,
  Profile,
}) {
  const transaction = await sequelize.transaction();
  try {
    const payingClient = await Profile.findByPk(profileId, { transaction });
    const receivingClient = await Profile.findByPk(userId, { transaction });

    if (amount > payingClient.balance) {
      throw new AppError(`Amount unavailable`, 400);
    }

    const totalUnpaidJobsAmount = await Job.sum(
      "price",
      {
        where: { paid: null },
        include: [
          {
            model: Contract,
            where: {
              status: { [Op.ne]: "terminated" },
              [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
            },
          },
        ],
      },
      { transaction }
    );

    if (totalUnpaidJobsAmount && amount > (totalUnpaidJobsAmount / 100) * 25) {
      throw new AppError("You exceeded the amount you can deposit", 400);
    }

    payingClient.balance -= amount;
    receivingClient.balance += amount;

    await payingClient.save({ transaction });
    await receivingClient.save({ transaction });

    await transaction.commit();

    return receivingClient;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = { depositBalance };

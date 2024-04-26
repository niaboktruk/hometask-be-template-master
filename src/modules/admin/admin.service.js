const { Op } = require("sequelize");

async function findBestProfession({
  sequelize,
  startDate,
  endDate,
  Job,
  Contract,
  Profile,
}) {
  const bestProfessions = await Job.findAll({
    include: {
      model: Contract,
      where: { status: { [Op.ne]: "terminated" } },
      attributes: ["id"],
      include: {
        model: Profile,
        as: "Contractor",
        attributes: ["profession"],
      },
    },
    attributes: [
      "id",
      [sequelize.fn("sum", sequelize.col("price")), "amountEarned"],
    ],
    where: { paymentDate: { [Op.between]: [startDate, endDate] } },
    group: ["Contract.Contractor.id"],
    order: [[sequelize.col("amountEarned"), "DESC"]],
    raw: true,
    nest: true,
  });

  if (!bestProfessions || bestProfessions.length === 0) {
    return [];
  }

  const { profession } = bestProfessions[0].Contract?.Contractor || {};

  return profession;
}

async function findBestClients({
  limit,
  sequelize,
  Job,
  Profile,
  Contract,
  startDate,
  endDate,
}) {
  const bestClients = await Job.findAll({
    include: {
      model: Contract,
      where: { status: { [Op.ne]: "terminated" } },
      attributes: ["id"],
      include: {
        model: Profile,
        as: "Client",
        attributes: ["id", "firstName", "lastName"],
      },
    },
    attributes: [[sequelize.fn("sum", sequelize.col("price")), "paid"]],
    where: { paymentDate: { [Op.between]: [startDate, endDate] } },
    group: ["Contract.Client.id"],
    order: [[sequelize.col("paid"), "DESC"]],
    limit,
    raw: true,
    nest: true,
  });

  return bestClients;
}

module.exports = { findBestProfession, findBestClients };

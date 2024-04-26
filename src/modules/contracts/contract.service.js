const { Op } = require("sequelize");

async function getById({ profile: { id: profileId }, Contract, id }) {
  const contract = await Contract.findOne({
    where: {
      id,
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
    },
  });

  return contract;
}

async function getAllNotTerminated({ profile: { id: profileId }, Contract }) {
  const contracts = await Contract.findAll({
    where: {
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      [Op.not]: { status: "terminated" },
    },
  });

  return contracts;
}

module.exports = { getById, getAllNotTerminated };

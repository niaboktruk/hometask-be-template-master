const contractService = require("./contract.service");

/**
 * This API is NOT broken anymore 😵! it returns
 * the contract only if it belongs to the profile calling.
 */
async function getById(req, res) {
  const { Contract } = req.app.get("models");
  const { id } = req.params;
  const profile = req.profile;

  const contract = await contractService.getById({ id, profile, Contract });

  if (!contract) return res.status(404).end();

  res.json(contract);
}

/**
 * Returns a list of contracts belonging to a user (client or contractor),
 * the list should only contain non terminated contracts.
 */
async function getAllNotTerminated(req, res) {
  const { Contract } = req.app.get("models");
  const profile = req.profile;

  const contracts = await contractService.getAllNotTerminated({
    profile,
    Contract,
  });

  res.json(contracts);
}

module.exports = { getById, getAllNotTerminated };

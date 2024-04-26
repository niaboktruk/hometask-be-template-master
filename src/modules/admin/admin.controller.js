const adminService = require("./admin.service");

/**
 * Returns the profession that earned the most money (sum of jobs paid)
 * for any contactor that worked in the query time range.
 */
async function findBestProfession(req, res, next) {
  const sequelize = req.app.get("sequelize");
  const { Job, Contract, Profile } = req.app.get("models");
  const { start, end } = req.query;

  try {
    const bestProfession = await adminService.findBestProfession({
      sequelize,
      Job,
      Contract,
      Profile,
      startDate: start,
      endDate: end,
    });

    res.json(bestProfession);
  } catch (error) {
    next(error);
  }
}

/**
 * Returns the clients the paid the most for jobs in the query time period.
 * Limit query parameter should be applied, default limit is 2.
 */
async function findBestClients(req, res, next) {
  const { Job, Contract, Profile } = req.app.get("models");

  try {
    const sequelize = req.app.get("sequelize");
    const { start, end, limit = 2 } = req.query;

    const bestClients = await adminService.findBestClients({
      limit,
      sequelize,
      Job,
      Contract,
      Profile,
      startDate: start,
      endDate: end,
    });

    const bestClientsMapped = bestClients.map((client) => {
      const { id, firstName, lastName } = client.Contract.Client;

      return {
        id,
        fullName: `${firstName} ${lastName}`,
        paid: client.paid,
      };
    });

    res.json(bestClientsMapped);
  } catch (error) {
    next(error);
  }
}

module.exports = { findBestProfession, findBestClients };

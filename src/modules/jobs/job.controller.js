const { AppError } = require("../../shared/AppError");
const jobService = require("./job.service");

/**
 * Get all unpaid jobs for a user (***either*** a
 * client or contractor), for ***active contracts only***.
 */
async function getUnpaidJobs(req, res) {
  const { Contract, Job } = req.app.get("models");
  const profile = req.profile;

  const unpaidJobs = await jobService.findUnpaidClientJobs({
    profile,
    Contract,
    Job,
  });

  res.json(unpaidJobs);
}

/**
 * Pay for a job, a client can only pay if his balance >= the amount to pay.
 * The amount should be moved from the client's balance to the contractor balance.
 */
async function payJob(req, res) {
  const { Contract, Job, Profile } = req.app.get("models");
  const sequelize = req.app.get("sequelize");
  const { job_id } = req.params;
  const profile = req.profile;

  try {
    if (req.profile.type !== "client")
      throw new AppError("Need a client to pay a job", 400);

    const paidJob = await jobService.completeJobPayment({
      jobId: job_id,
      profile,
      Contract,
      Job,
      Profile,
      sequelize,
    });

    res.json(paidJob);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message }).end();
  }
}

module.exports = { getUnpaidJobs, payJob };

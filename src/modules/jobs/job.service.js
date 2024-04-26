const { Op } = require("sequelize");
const { AppError } = require("../../shared/AppError");

async function findUnpaidClientJobs({
  profile: { id: profileId },
  Contract,
  Job,
}) {
  const unpaidJobs = await Job.findAll({
    where: {
      paid: null,
    },
    include: {
      model: Contract,
      where: {
        status: { [Op.ne]: "terminated" },
        ClientId: profileId,
      },
    },
  });

  return unpaidJobs;
}

async function completeJobPayment({
  profile: { id: profileId },
  jobId,
  Contract,
  Job,
  Profile,
  sequelize,
}) {
  const transaction = await sequelize.transaction();

  try {
    const job = await Job.findOne(
      {
        where: { id: jobId },
        include: [
          {
            model: Contract,
            where: {
              status: { [Op.ne]: "terminated" },
              ClientId: profileId,
            },
          },
        ],
      },
      { transaction }
    );

    if (!job) {
      throw new AppError("Job not found or contract already terminated", 403);
    }

    if (job.paid) {
      throw new AppError("Job already paid", 403);
    }

    const client = await Profile.findByPk(job.Contract.ClientId, {
      transaction,
    });

    const contractor = await Profile.findByPk(job.Contract.ContractorId, {
      transaction,
    });

    if (client.balance < job.price) {
      throw new AppError("Insufficient balance", 403);
    }

    job.paid = true;
    job.paymentDate = new Date();
    client.balance -= job.price;
    contractor.balance += job.price;

    if (job.Contract.status === "new") {
      job.Contract.status = "in_progress";
    }

    await job.save({ transaction });
    await job.Contract.save({ transaction });
    await client.save({ transaction });
    await contractor.save({ transaction });
    await transaction.commit();

    return job;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = { findUnpaidClientJobs, completeJobPayment };

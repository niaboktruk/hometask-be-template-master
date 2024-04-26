const express = require("express");
const { getUnpaidJobs, payJob } = require("../modules/jobs/job.controller");

const jobRoute = express.Router();

jobRoute.get("/unpaid", getUnpaidJobs);
jobRoute.post("/:job_id/pay", payJob);

module.exports = jobRoute;

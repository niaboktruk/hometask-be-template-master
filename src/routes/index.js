const express = require("express");
const contractRoute = require("./contract");
const jobRoute = require("./job");
const balanceRoute = require("./balance");
const adminRoute = require("./admin");

const routes = express.Router();

routes.use("/contracts", contractRoute);
routes.use("/jobs", jobRoute);
routes.use("/balances", balanceRoute);
routes.use("/admin", adminRoute);

routes.use((req, res) => {
  res.status(404).json({
    message: `Route '${req.method} ${req.url}' not found`,
  });
});

module.exports = routes;

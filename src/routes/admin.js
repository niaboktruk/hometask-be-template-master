const express = require("express");
const {
  findBestProfession,
  findBestClients,
} = require("../modules/admin/admin.controller");

const adminRoute = express.Router();

adminRoute.get("/best-profession", findBestProfession);
adminRoute.get("/best-clients", findBestClients);

module.exports = adminRoute;

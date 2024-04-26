const express = require("express");
const {
  getById,
  getAllNotTerminated,
} = require("../modules/contracts/contract.controller");

const contractRoute = express.Router();

contractRoute.get("/", getAllNotTerminated);
contractRoute.get("/:id", getById);

module.exports = contractRoute;

const express = require("express");
const { deposit } = require("../modules/balances/balance.controller");

const balanceRoute = express.Router();

balanceRoute.post("/deposit/:userId", deposit);

module.exports = balanceRoute;

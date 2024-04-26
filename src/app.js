const express = require("express");
const { sequelize } = require("./model");
const { getProfile } = require("./middleware/getProfile");
const routes = require("./routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use(getProfile);
app.use(routes);
app.use(errorHandler);

module.exports = app;

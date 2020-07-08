const package = require("../package.json");
const path = require("path");

const port = process.env.PORT || 8080;
const staticPath = path.join("dist", package.name);

const config = {
  port,
  staticPath,
};

module.exports = config;

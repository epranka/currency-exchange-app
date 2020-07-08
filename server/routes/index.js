const express = require("express");
const apis = require("./apis");

module.exports = function routesFactory(server) {
  const router = express.Router();

  router.use(express.static(server.get("static-path")));

  router.use("/api", apis());

  return router;
};

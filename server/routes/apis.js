const express = require("express");
const quoteService = require("../services/quote");

module.exports = function apisFactory() {
  const router = express.Router();

  router.get("/quote", quoteService);

  return router;
};

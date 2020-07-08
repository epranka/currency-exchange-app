const express = require("express");
const apis = require("./apis");

module.exports = function routesFactory(server) {
  const router = express();

  router.use(express.static(server.get("static-path")));

  router.use("/api", apis());

  router.use((err, req, res, next) => {
    if (err) {
      if (!err.status || err.status === 500) {
        console.error(err.stack);
      }
      return res
        .status(err.status || 500)
        .json({ error: err.statusText || "Internal server error" });
    } else {
      return next();
    }
  });

  return router;
};

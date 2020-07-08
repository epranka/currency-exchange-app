const express = require("express");
const config = require("./config");
const routes = require("./routes");

module.exports = function app() {
  const server = express();

  server.set("static-path", config.staticPath);

  const create = () => {
    server.use(routes(server));
  };

  const start = () => {
    server.listen(config.port, () => {
      console.log("Application is listening on port", config.port);
    });
  };

  return { create, start };
};

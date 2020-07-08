const express = require("express");
const config = require("./config");
const morgan = require("morgan");
const helmet = require("helmet");
const routes = require("./routes");
const BaseError = require("./BaseError");

module.exports = function app() {
  const server = express();

  server.set("static-path", config.staticPath);

  const create = () => {
    server.use(helmet());
    server.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"));

    server.use(routes(server));

    server.use((err, req, res, next) => {
      if (err) {
        if (err instanceof BaseError) {
          return err.toResponse(res);
        } else {
          if (err.stack) console.error(err.stack);
          else console.error(err.toString());
          return res
            .status(500)
            .json({ error: err.statusText || "Internal server error" });
        }
      } else {
        return next();
      }
    });
  };

  const start = () => {
    server.listen(config.port, () => {
      console.log("Application is listening on port", config.port);
    });
  };

  return { create, start };
};

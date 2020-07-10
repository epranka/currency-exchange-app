const express = require("express");
const config = require("./config");
const morgan = require("morgan");
const helmet = require("helmet");
const routes = require("./routes");
const BaseError = require("./errors/BaseError");

module.exports = function appFactory() {
  const app = express();
  let created = false;
  let server;

  app.set("static-path", config.staticPath);

  const create = () => {
    app.use(helmet());
    app.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"));

    app.use(routes(app));

    app.use((err, _req, res, next) => {
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

    created = true;
  };

  const start = () => {
    if (!created) {
      throw new Error("Use app.create() before the starting the server");
    }
    return new Promise((resolve, reject) => {
      server = app.listen(config.port, (err) => {
        if (err) return reject(err);
        console.log("Application is listening on port", config.port);
        return resolve();
      });
    });
  };

  const close = () => {
    if (!server) {
      throw new Error(
        "Cannot close the server. Probably it is not started yet"
      );
    }
    return new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  };

  return { create, start, close, app };
};

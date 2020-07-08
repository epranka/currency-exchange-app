const backendPort = process.env.PORT || 8080;

module.exports = {
  "/api": {
    target: `http://localhost:${backendPort}`,
    secure: "false",
  },
};

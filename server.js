const express = require("express");
const app = express();

const port = process.env.PORT || 8080;

app.use(express.static("dist/currency-exchange-app"));

app.listen(port, () => {
  console.log("Application is listening on port", port);
});

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const bearerToken = require("express-bearer-token");
const auth = require("../api/middlewares/auth");
const routes = require("../api/routes/v1/index");
const error = require("../api/utils/error");
const { port } = require("../config/var");

/**
 * express instance
 */
const app = express();
const http = require("http").createServer(app);
const apiRequestLimiterAll = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 90000,
});
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(bodyParser.json({ limit: "5000mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "5000mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(bearerToken());

app.use("/v1/", apiRequestLimiterAll);

app.use(cors(corsOptions));

// compress all responses
app.use(compression());

// authentication middleware to get token
app.use(auth.authenticate);

// mount API v1 routes
app.use("/v1", routes);

// if error is not an instance of API error, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

http.listen(port);

module.exports = app;

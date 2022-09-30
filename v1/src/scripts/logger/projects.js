const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: "v1/src/logs/projects/error.log", level: "error" }),
    new winston.transports.File({ filename: "v1/src/logs/projects/info.log", level: "info" }),
    new winston.transports.File({ filename: "v1/src/logs/projects/combined.log" }),
  ],
});

module.exports = logger;

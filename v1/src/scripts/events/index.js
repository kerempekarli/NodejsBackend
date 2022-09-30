const eventEmitter = require("./eventEmitter");

module.exports = () => {
    eventEmitter.on("send_email", () => {
        console.log("event alındı", data);
      });
}
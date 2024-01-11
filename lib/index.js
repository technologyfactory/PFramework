require("./.bin");
mongodb = require("./mongodb");
express = require("./express");
// redis = require("./redis");
otpService = require("./otp");
rabbitmq = require("./rabbitmq");






module.exports = { mongodb, express, otpService, rabbitmq };

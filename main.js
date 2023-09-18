const { test } = require("./src");
const { express } = require("./lib");

///////////////////////Test//////////////////////////////
express.routing.get("/v1/test", function (req, res) {
    test.sample.ex(req, res)
});
///////////////////////test//////////////////////////////



///////////////////////Socket PullData Test //////////////////////////////
express.io.on('connection', (socket) => {
    console.log("Start Socket Connection");
    socket.on("pullData", function (data) {
        test.socketSample.ex(express.io)
    });
});
///////////////////////socket pullData test //////////////////////////////



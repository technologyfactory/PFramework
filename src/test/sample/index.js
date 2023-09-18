const { generateRandomCode, getErrorMessage } = require('../../utils');
ex = function (req, res) {

    const TestCode = generateRandomCode(12);
    console.log('Test   --->   ' + TestCode)

    resp0nse("200", "200", TestCode)

    function resp0nse(errorCode, status, data) {
        const errorMessage = getErrorMessage(errorCode);
        res.status(status).json({
            "response_code": errorCode,
            "response_message": errorMessage,
            "data": data
        });
    }


}
module.exports = {
    ex,
};

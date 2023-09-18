const { generateRandomCode } = require('../../utils');
ex = function (io) {
    const TestCode = generateRandomCode(12);
    io.emit('back', TestCode);
    console.log('Test   --->   ' + TestCode)
}
module.exports = {
    ex,
};

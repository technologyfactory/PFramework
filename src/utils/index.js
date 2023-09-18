const { redis, otpService } = require("../../lib");
const jwt = require('jsonwebtoken');

async function getRedisData(username) {
    return new Promise((resolve, reject) => {
        redis.client.hgetall(username, (err, reply) => {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        });
    });
}

async function delRedisData(username) {
    return new Promise((resolve, reject) => {
        redis.client.del(username);
    });
}

async function setRedisData(username, data) {
    // const data = {
    //     'otp': otp,
    //     'try_count': process.env.try_count,
    //     'is_block': false
    // };

    await new Promise((resolve, reject) => {
        redis.client.hmset(username, data, (err, reply) => {
            if (err) {
                reject(err);
            } else {
                redis.client.expire(username, parseInt(process.env.try_time));
                resolve(reply);
            }
        });
    });
}

async function updateRedisData(username, otp, tryCount, isBlock) {
    const data = {
        'otp': otp,
        'try_count': tryCount,
        'is_block': isBlock
    };

    await new Promise((resolve, reject) => {
        redis.client.hmset(username, data, (err, reply) => {
            if (err) {
                reject(err);
            } else {
                if (isBlock) {
                    redis.client.expire(username, parseInt(process.env.block_time));
                } else {
                    redis.client.expire(username, parseInt(process.env.try_time));
                }
                resolve(reply);
            }
        });
    });
}

async function sendOtp(username, otp) {
    return new Promise((resolve, reject) => {
        otpService.Send(username, otp, 'otplogin', 'public', (error, statusCode, responseData) => {
            if (error) {
                reject(error);
            } else {
                resolve({ error: null, statusCode, responseData });
            }
        });
    });
}


function generateRandomCode(length) {
    const characters = '0123456789'; // مجموعه کاراکترهای ممکن برای کد
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}


const errorMessages = {
    '500': "خطای سیستمی",
    '200': ' عملیات با موفقیت انجام شد ',
    '800': "شما بیش از اندازه تلاش کرده اید، بروید استراحت :)",
    // ...
};

function getErrorMessage(errorCode) {
    const errorMessage = errorMessages[errorCode];
    if (errorMessage) {
        return errorMessage;
    } else {
        return 'خطای ناشناخته';
    }
}


function generateBearerToken(user) {    
    const token = jwt.sign(user, process.env.secretKey, {
        expiresIn: process.env.expiresInDays * 24 * 60 * 60
    });
    return token;
}


module.exports = {
    generateBearerToken,
    getErrorMessage,
    generateRandomCode,
    getRedisData,
    setRedisData,
    updateRedisData,
    sendOtp,
    delRedisData,
};
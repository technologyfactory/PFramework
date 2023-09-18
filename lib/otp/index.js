

const axios = require('axios');

async function Send(phoneNumber, token, template, provider, mainCallback) {
    const apiUrl = 'http://apigateway.peppy.group/messages/v1/sms/otp/send';

    // تنظیمات درخواست
    const options = {
        headers: {
            'Authorization': 'Bearer 4901934950f12a515a6f0abaea583beb140de72a' // جای YOUR_ACCESS_TOKEN را با توکن واقعی خود پر کنید
        }
    };

    // داده‌های JSON برای ارسال
    const data = {
        to: phoneNumber,
        code: token,
        template: template,
        provider: provider
    };

    // ارسال درخواست POST با axios
    await axios.post(apiUrl, data, options)
        .then(response => {
            mainCallback(null, response.status, response.data); // Pass statusCode and responseData to the main callback
        })
        .catch(error => {
            //console.error(error);
            mainCallback(error, null, null); // Pass the error to the main callback
        });
}






module.exports = {
    Send

};
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


const setInterval = require('timers').setInterval;

// تابعی برای تولید رشته جدید
function generateRandomString() {
    const length = 10; // طول رشته مورد نظر
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

// تابعی برای تولید رشته جدید و چاپ آن هر سه ثانیه




// بخش تعیین ایدی کاربر
io.on('connection', (socket) => {

    socket.on("message", function (data) {
        // رویداد "messageFromServer" به کلاینت ارسال می‌شود
        console.log("Received message:", data);

        function generateAndPrintString() {
            const randomString = generateRandomString();
            console.log(`Generated String: ${randomString}`);
            socket.emit("messageFromServer", randomString);

        }

        // تنظیم تابع بالا به عنوان یک تایمر با فاصله 3 ثانیه


        if (data.userId == "8128381283") {
            console.log("892363489294962369")
            setInterval(generateAndPrintString, 500);

        } else {
            console.log("11111111111111")
            //  socket.emit("messageFromServer", "11111111111111");

        }
    });



});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const { rabbitmq } = require("./lib");




// تست تابع sendMessage
async function testSendMessage() {
    try {
        const queueName = 'saf1';
        const message = 'Hello, RabbitMQ! EEEE___>>>';
        await rabbitmq.send(queueName, message);
        console.log(`Message sent to queue: ${queueName}`);
    } catch (error) {
        console.error(`Error testing sendMessage: ${error.message}`);
    }
}

// تست تابع receiveMessage
async function testReceiveMessage() {
    try {
        const queueName = 'saf1';
        rabbitmq.receive(queueName, (message) => {
            console.log('Received message:', message);
        });
    } catch (error) {
        console.error(`Error testing receiveMessage: ${error.message}`);
    }
}


// فراخوانی توابع تست
testSendMessage();
testReceiveMessage();
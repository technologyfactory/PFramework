// rabbitmqService.js

const amqp = require('amqplib');

class RabbitMQService {
    constructor() {
        // تنظیمات RabbitMQ
        this.rabbitMQHost = process.env.RABBITMQ_HOST;
        this.rabbitMQPort = process.env.RABBITMQ_PORT;
        this.rabbitMQUsername = process.env.RABBITMQ_USERNAME;
        this.rabbitMQPassword = process.env.RABBITMQ_PASSWORD;

        this.connection = null;
        this.channel = null;
        this.isConnected = false;
    }

    async ensureConnection() {
        if (!this.isConnected) {
            await this.connect();
        }
    }

    async connect() {
        try {
            this.connection = await amqp.connect(
                `amqp://${this.rabbitMQUsername}:${this.rabbitMQPassword}@${this.rabbitMQHost}:${this.rabbitMQPort}`
            );
            this.channel = await this.connection.createChannel();
            this.isConnected = true;
        } catch (error) {
            console.error(`Error connecting to RabbitMQ: ${error.message}`);
            throw error;
        }
    }

    async send(queueName, message) {
        try {
            await this.ensureConnection();
            this.channel.assertQueue(queueName, { durable: false });
            this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
            // console.log(`[x] Sent: ${JSON.stringify(message)} to queue: ${queueName}`);
        } catch (error) {
            console.error(`Error sending message to queue ${queueName}: ${error.message}`);
            throw error;
        }
    }

    async receive(queueName, callback) {
        try {
            await this.ensureConnection();
            console.log(`[*] Waiting for messages in ${queueName}. To exit, press CTRL+C`);
            this.channel.assertQueue(queueName, { durable: false });
            this.channel.consume(queueName, (message) => {
                if (callback) {
                    const messageString = message.content.toString('utf8');
                    try {
                        const jsonData = JSON.parse(messageString);
                        callback(jsonData);
                    } catch (parseError) {
                        console.error(`Error parsing JSON: ${parseError.message}`);
                    }
                }
            }, { noAck: true });
        } catch (error) {
            console.error(`Error receiving message from queue ${queueName}: ${error.message}`);
            throw error;
        }
    }



    async receiveACK(queueName, count, callback) {
        try {
            await this.ensureConnection();
            console.log(`[*] Waiting for messages in ${queueName}. To exit, press CTRL+C`);
            this.channel.assertQueue(queueName, { durable: false });

            this.channel.prefetch(count);

            this.channel.consume(queueName, (message) => {
                if (message !== null) {
                    console.log(`Received message: ${message.content.toString()}`);

                    // ارسال پیام و کانال به callback برای امکان تأیید
                    callback(message, this.channel);
                }
            }, { noAck: false }); // تغییر به noAck: false
        } catch (error) {
            console.error(`Error receiving message from queue ${queueName}: ${error.message}`);
            throw error;
        }
    }



    async close() {
        try {
            await this.channel.close();
            await this.connection.close();
            this.isConnected = false;
        } catch (error) {
            console.error(`Error closing connection: ${error.message}`);
            throw error;
        }
    }
}

const rabbitmqService = new RabbitMQService();
module.exports = rabbitmqService;

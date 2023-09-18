const amqp = require('amqplib');

class RabbitMQService {
    constructor() {
        this.rabbitMQHost = process.env.RABBITMQ_HOST || '65.109.219.155';
        this.rabbitMQPort = process.env.RABBITMQ_PORT || 5672;
        this.rabbitMQUsername = process.env.RABBITMQ_USERNAME || 'root';
        this.rabbitMQPassword = process.env.RABBITMQ_PASSWORD || '66336633';
        this.connection = null;
        this.channel = null;
        this.isConnected = false;
    }

    async connect() {
        if (this.isConnected) return;

        try {
            this.connection = await amqp.connect(`amqp://${this.rabbitMQUsername}:${this.rabbitMQPassword}@${this.rabbitMQHost}:${this.rabbitMQPort}`);
            this.channel = await this.connection.createChannel();
            this.isConnected = true;
        } catch (error) {
            throw new Error(`Error connecting to RabbitMQ: ${error.message}`);
        }
    }

    async send(queueName, message) {
        try {
            await this.connect();
            this.channel.assertQueue(queueName, { durable: false });
            this.channel.sendToQueue(queueName, Buffer.from(message));
            console.log(`[x] Sent: ${message} to queue: ${queueName}`);
        } catch (error) {
            throw new Error(`Error sending message to queue ${queueName}: ${error.message}`);
        }
    }

    async receive(queueName, callback) {
        try {
            await this.connect();
            console.log(`[*] Waiting for messages in ${queueName}. To exit, press CTRL+C`);
            this.channel.assertQueue(queueName, { durable: false });
            this.channel.consume(queueName, (message) => {
                console.log(`[x] Received: ${message.content.toString()} from queue: ${queueName}`);
                if (callback) {
                    callback(message.content.toString());
                }
            }, { noAck: true });
        } catch (error) {
            throw new Error(`Error receiving message from queue ${queueName}: ${error.message}`);
        }
    }
}

module.exports = new RabbitMQService();

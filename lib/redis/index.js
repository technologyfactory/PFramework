const redis = require("redis");
// Create a Redis client
const client = redis.createClient({
    host: "",
    port: 6379,
});


// Connect to Redis server
client.on("connect", () => {
    console.log("Connected to Redis server");
});


// Set a key-value pair
client.set("mykey1", "test", (err, reply) => {
    // console.log(reply);
});


// Get a value by key
client.get("mykey1", (err, reply) => {
    // console.log(reply);
});

client.hmset("frameworks_hash", {
    javascript: "ReactJS",
    css: "TailwindCSS",
    node: "Express",
});


client.hgetall("frameworks_hash", (err, reply) => {
    // console.log(reply);
});

module.exports = { client };

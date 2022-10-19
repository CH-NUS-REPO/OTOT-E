const express = require("express");
const User = require("./model/user");
const cors = require('cors')
const { createClient } = require('redis');
require("./config/database").connect();

const app = express();
app.use(express.json());
app.use(cors());

const client = createClient({
    url: process.env.REDIS_URI
});
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect().then(() => { console.log('Connected to redis') });

app.get("/delete/cache", async (req, res) => {
    client.del('all-users');
    return res.status(200).send("Cache deleted.");
})

app.get("/user/all", async (req, res) => {
    const cache = await client.get('all-users');
    if (cache) {
        const users = JSON.parse(cache);
        return res.status(200).send(`Cache hit! Showing the first 20 records out of ${users.length} records: ${JSON.stringify(users.slice(0, 20))}`);
    }

    try {
        const users = await User.find({});
        const users_str = JSON.stringify(users);
        await client.set('all-users', users_str);
        return res.status(200).send(`Cache miss... Showing the first 20 records out of ${users.length} records: ${JSON.stringify(users.slice(0, 20))}`);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Failed to get users.");
    }
});

module.exports = app;
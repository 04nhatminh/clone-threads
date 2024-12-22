const { createClient } = require('redis');

const redisClient = createClient({
    url: 'rediss://red-ct8uaq5ds78s73ch9d50:jsCk4S0kocDWyBVza0v97HBm72d0aMIl@singapore-redis.render.com:6379'
});

redisClient.connect().catch(console.error);

module.exports = redisClient;

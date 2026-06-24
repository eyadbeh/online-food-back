require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDatabase = require('./config/database');
const setupSocketHandlers = require('./sockets');
const { init } = require('./utils/io');

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || '*', methods: ['GET', 'POST'] },
});

init(io);
setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;

connectDatabase().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

module.exports = io;

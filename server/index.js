const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Import routes and socket handlers
const apiRoutes = require('./api/routes.js');
const { 
    join_game, 
    waiting_room_update, 
    start_game, 
    game_started 
} = require('./sockets/handlers.js');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach Socket.IO server to HTTP server
const io = socketIo(server, {
    cors: {
        origin: "*", // In production, replace with your frontend URL
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register all WebSocket event handlers
    socket.on('join_game', (data) => {
        join_game(io, socket, data);
    });

    socket.on('start_game', (data) => {
        start_game(io, socket, data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// app.all('/{*any}', (req, res) => {
//     res.status(404).json({ error: 'API endpoint not found' });
// });

// Start listening on port
server.listen(PORT, () => {
    console.log(`🚀 Doggo Monopoly server running on port ${PORT}`);
    console.log(`📡 Socket.IO server attached to HTTP server`);
    console.log(`🌐 API available at http://localhost:${PORT}/api`);
    console.log(`🎮 Game server ready for connections`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = { app, server, io };
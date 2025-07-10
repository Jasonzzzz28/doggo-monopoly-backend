import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// Import routes and socket handlers
import apiRoutes from './api/routes';
import { 
    connect_to_game, 
    start_game, 
    player_buy_dish,
    player_remove_dish,
    player_buy_store,
    player_host_doggo
} from './sockets/handlers';

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach Socket.IO server to HTTP server
const io = new Server(server, {
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
app.get('/health', (req: express.Request, res: express.Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register all WebSocket event handlers
    socket.on('connect_to_game', (data) => {
        connect_to_game(io, socket, data);
    });

    socket.on('start_game', (data) => {
        start_game(io, socket, data);
    });

    socket.on('player_buy_dish', (data) => {
        player_buy_dish(io, socket, data);
    });

    socket.on('player_remove_dish', (data) => {
        player_remove_dish(io, socket, data);
    });

    socket.on('player_buy_store', (data) => {
        player_buy_store(io, socket, data);
    });

    socket.on('player_host_doggo', (data) => { 
        player_host_doggo(io, socket, data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    //disconnect all players
    io.sockets.sockets.forEach(socket => {
        socket.disconnect();
    });
    //close server
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

export { app, server, io }; 
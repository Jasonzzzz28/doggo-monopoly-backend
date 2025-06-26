const memoryStore = require('../game/memoryStore.js');
const { GameStatus } = require('../game/game.js');

/**
 * Called when a player wants to join a game using a game code and name.
 * Adds the player to the game's player list and notifies all players in the room.
 * @param {object} io - The socket.io server instance
 * @param {object} socket - The socket for the joining player
 * @param {object} data - { gameId, playerId, playerName, avatar }
 */
function join_game(io, socket, data) {
    const { gameId, playerId, playerName, avatar } = data;
    const game = memoryStore.get(gameId);
    if (!game) {
        socket.emit('error', { message: 'Game not found.' });
        return;
    }
    if (game.status !== GameStatus.WAITING) {
        socket.emit('error', { message: 'Game has already started.' });
        return;
    }
    if (game.isFull()) {
        socket.emit('error', { message: 'Game is full.' });
        return;
    }
    const added = game.addPlayer(playerId, playerName, avatar);
    if (!added) {
        socket.emit('error', { message: 'Player could not be added.' });
        return;
    }
    socket.join(gameId);
    // Notify all players in the room of the updated waiting room
    waiting_room_update(io, gameId);
}

/**
 * Sends the current waiting room status to all players in the game room.
 * @param {object} io - The socket.io server instance
 * @param {string} gameId - The game room ID
 */
function waiting_room_update(io, gameId) {
    const game = memoryStore.get(gameId);
    if (!game) return;
    const players = game.getAllPlayers().map(p => p.getWaitingRoomSummary());
    io.to(gameId).emit('waiting_room_update', {
        players,
        maxPlayers: game.requiredPlayers
    });
}

/**
 * Called by the host player to begin the game. Only allowed if all expected players have joined.
 * @param {object} io - The socket.io server instance
 * @param {object} socket - The socket for the host player
 * @param {object} data - { gameId, playerId }
 */
function start_game(io, socket, data) {
    const { gameId, playerId } = data;
    const game = memoryStore.get(gameId);
    if (!game) {
        socket.emit('error', { message: 'Game not found.' });
        return;
    }
    // Any player in the game can start the game
    if (!game.playerOrder.includes(playerId)) {
        socket.emit('error', { message: 'Only players in the game can start the game.' });
        return;
    }
    if (!game.isReadyToStart()) {
        socket.emit('error', { message: 'Not all players have joined yet.' });
        return;
    }
    const started = game.startGame();
    if (!started) {
        socket.emit('error', { message: 'Game could not be started.' });
        return;
    }
    // Notify all players that the game has started
    game_started(io, gameId);
}

/**
 * Notifies all players in the game room that the game has started.
 * @param {object} io - The socket.io server instance
 * @param {string} gameId - The game room ID
 */
function game_started(io, gameId) {
    const game = memoryStore.get(gameId);
    if (!game) return;
    io.to(gameId).emit('game_started', {
        gameState: game.getGameState()
    });
}

module.exports = {
    join_game,
    waiting_room_update,
    start_game,
    game_started
};

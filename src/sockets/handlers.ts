import { Server, Socket } from 'socket.io';
import { ConnectToGameData, StartGameData, PlayerBuyDishData, PlayerRemoveDishData, PlayerBuyStoreData, PlayerHostDoggoData } from '../types';
import dataBase from '../services/dataService';
import { GameStatus } from '../game/gameStatus';
import { dishTypeMapper } from '../game/dishTypes';
import { Game } from '../game/game';

/**
 * Called when a player wants to join a game using a game code and name.
 * Adds the player to the game's player list and notifies all players in the room.
 * @param io - The socket.io server instance
 * @param socket - The socket for the joining player
 * @param data - { gameId, playerId }
 */
export function connect_to_game(io: Server, socket: Socket, data: ConnectToGameData): void {
    console.log('connect_to_game: ' + data);
    const { gameId, playerId } = data;
    const game = dataBase.get(gameId) as Game;
    if (!game) {
        socket.emit('error', { message: 'Game not found.' });
        console.log('Game not found.');
        console.log(gameId);
        return;
    }
    if (!(playerId in game.players)) {
        socket.emit('error', { message: 'Player not found in game.' });
        console.log('Player not found in game.');
        return;
    }
    if (game.status === GameStatus.ENDED) {
        socket.emit('error', { message: 'Game has ended.' });
        console.log('Game has ended.');
        return;
    }
    socket.join(gameId);
    // Notify all players in the room of the updated waiting room
    if (game.status === GameStatus.WAITING) {
        waiting_room_update(io, gameId);
    }
}

/**
 * Called by the host player to begin the game. Only allowed if all expected players have joined.
 * @param io - The socket.io server instance
 * @param socket - The socket for the host player
 * @param data - { gameId, playerId }
 */
export function start_game(io: Server, socket: Socket, data: StartGameData): void {
    console.log('start_game called: ' + data);
    const { gameId, playerId } = data;
    const game = dataBase.get(gameId) as Game;
    if (!game) {
        console.log('Start game: Game not found.');
        socket.emit('error', { message: 'Game not found.' });
        return;
    }
    // Only players in the game can start the game
    if (!game.playerOrder.includes(playerId)) {
        console.log('Start game: Only players in the game can start the game.');
        socket.emit('error', { message: 'Only players in the game can start the game.' });
        return;
    }
    if (!game.isReadyToStart()) {
        console.log('Start game: Game is not ready to start or already started.');
        socket.emit('error', { message: 'Game is not ready to start or already started.' });
        return;
    }
    console.log('Game started wtf. ' + gameId);
    const started = game.startGame();
    console.log('Game started0. ' + gameId);
    if (!started) {
        console.log('Game could not be started.');
        socket.emit('error', { message: 'Game could not be started.' });
        return;
    }
    // Notify all players that the game has started
    console.log('Game started. ' + gameId);
    game_update(io, gameId);
}

/**
 * Sends the current waiting room status to all players in the game room.
 * @param io - The socket.io server instance
 * @param gameId - The game room ID
 */
function waiting_room_update(io: Server, gameId: string): void {
    console.log('waiting_room_update: ' + gameId);
    const game = dataBase.get(gameId) as Game;
    if (!game) return;
    const summary = game.getWaitingRoomSummary();
    io.to(gameId).emit('waiting_room_update', summary);
}

/**
 * Notifies all players in the game room that the game has updated.
 * @param io - The socket.io server instance
 * @param gameId - The game room ID
 */
function game_update(io: Server, gameId: string): void {
    const game = dataBase.get(gameId) as Game;
    if (!game) return;
    io.to(gameId).emit('game_update', {
        game: game.toResponse()
    });
}

export function player_buy_dish(io: Server, socket: Socket, data: PlayerBuyDishData): void {
    const { gameId, playerId, dishType } = data;
    const game = dataBase.get(gameId) as Game;
    if (!game) return;
    if (playerId !== game.getCurrentPlayerId()) {
        socket.emit('error', { message: 'Only the current player can buy dishes.' });
        return;
    }
    const success = game.sellDishCardToCurrentPlayer(dishTypeMapper[dishType.type]);
    if (!success) {
        socket.emit('error', { message: 'Failed to buy dish.' });
    }
    game_update(io, gameId);
}

export function player_remove_dish(io: Server, socket: Socket, data: PlayerRemoveDishData): void {
    const { gameId, playerId, dishIndex } = data;
    const game = dataBase.get(gameId) as Game;
    if (!game) return;
    if (playerId !== game.getCurrentPlayerId()) {
        socket.emit('error', { message: 'Only the current player can remove dishes.' });
        return;
    }
    const success = game.currentPlayerRemoveDishCard(dishIndex);
    if (!success) {
        socket.emit('error', { message: 'Failed to remove dish.' });
    }
    game_update(io, gameId);
}

export function player_buy_store(io: Server, socket: Socket, data: PlayerBuyStoreData): void {
    const { gameId, playerId, storeIndex } = data;
    const game = dataBase.get(gameId) as Game;
    if (!game) return;
    if (playerId !== game.getCurrentPlayerId()) {
        socket.emit('error', { message: 'Only the current player can buy stores.' });
        return;
    }
    const store = game.storeMarket.visible[storeIndex];
    if (!store) {
        socket.emit('error', { message: 'Store not found.' });
        return;
    }
    const success = game.sellStoreCardToCurrentPlayer(storeIndex);
    if (!success) {
        socket.emit('error', { message: 'Failed to buy store.' });
    }
    game_update(io, gameId);
}

export function player_host_doggo(io: Server, socket: Socket, data: PlayerHostDoggoData): void {
    const { gameId, playerId, doggoIndex } = data;
    const game = dataBase.get(gameId) as Game;
    if (!game) return;
    if (playerId !== game.getCurrentPlayerId()) {
        socket.emit('error', { message: 'Only the current player can host doggos.' });
        return;
    }
    const doggo = game.npcDoggos.visible[doggoIndex];
    if (!doggo) {
        socket.emit('error', { message: 'Doggo not found.' });
        return;
    }
    const success = game.assignDoggoCardToCurrentPlayer(doggoIndex);
    if (!success) {
        socket.emit('error', { message: 'Failed to host doggo.' });
    }
    game_update(io, gameId);
} 
const Game = require('../../../src/game/game.js');
const GameStatus = require('../../../src/game/gameStatus.js');

describe('Game', () => {
    let game;

    beforeEach(() => {
        game = new Game('test-game-1', 4);
    });

    describe('Game Creation', () => {
        test('should create a game with correct initial state', () => {
            expect(game.id).toBe('test-game-1');
            expect(game.status).toBe(GameStatus.WAITING);
            expect(game.requiredPlayers).toBe(4);
            expect(game.players).toEqual({});
            expect(game.playerOrder).toEqual([]);
            expect(game.currentPlayerIndex).toBe(0);
            expect(game.turnNumber).toBe(0);
            expect(game.createdAt).toBeDefined();
        });

        test('should initialize card piles correctly', () => {
            expect(game.npcDoggos).toEqual({
                visible: [],
                discardPile: [],
                drawPile: [],
                extraMoney: [0, 0, 0, 0]
            });
            expect(game.storeMarket).toEqual({
                visible: [],
                drawPile: []
            });
        });
    });

    describe('Player Management', () => {
        test('should add a player successfully', () => {
            const result = game.addPlayer('player1', 'Alice', '/avatar1.png');
            
            expect(result).toBe(true);
            expect(game.getPlayerCount()).toBe(1);
            expect(game.playerOrder).toContain('player1');
            expect(game.getPlayer('player1')).toBeDefined();
            expect(game.getPlayer('player1').name).toBe('Alice');
        });

        test('should not add duplicate players', () => {
            game.addPlayer('player1', 'Alice', '/avatar1.png');
            const result = game.addPlayer('player1', 'Alice', '/avatar1.png');
            
            expect(result).toBe(false);
            expect(game.getPlayerCount()).toBe(1);
        });

        test('should not add players when game is full', () => {
            // Add 4 players to fill the game
            game.addPlayer('player1', 'Alice', '/avatar1.png');
            game.addPlayer('player2', 'Bob', '/avatar2.png');
            game.addPlayer('player3', 'Charlie', '/avatar3.png');
            game.addPlayer('player4', 'Diana', '/avatar4.png');
            
            const result = game.addPlayer('player5', 'Eve', '/avatar5.png');
            
            expect(result).toBe(false);
            expect(game.getPlayerCount()).toBe(4);
        });

        test('should remove a player successfully', () => {
            game.addPlayer('player1', 'Alice', '/avatar1.png');
            game.addPlayer('player2', 'Bob', '/avatar2.png');
            
            const result = game.removePlayer('player1');
            
            expect(result).toBe(true);
            expect(game.getPlayerCount()).toBe(1);
            expect(game.playerOrder).not.toContain('player1');
            expect(game.getPlayer('player1')).toBeNull();
        });

        test('should return false when removing non-existent player', () => {
            const result = game.removePlayer('nonexistent');
            
            expect(result).toBe(false);
        });
    });

    describe('Game State Management', () => {
        test('should check if game is ready to start', () => {
            expect(game.isReadyToStart()).toBe(false);
            
            // Add required players
            game.addPlayer('player1', 'Alice', '/avatar1.png');
            game.addPlayer('player2', 'Bob', '/avatar2.png');
            game.addPlayer('player3', 'Charlie', '/avatar3.png');
            game.addPlayer('player4', 'Diana', '/avatar4.png');
            
            expect(game.isReadyToStart()).toBe(true);
        });

        test('should check if game is full', () => {
            expect(game.isFull()).toBe(false);
            
            // Add required players
            game.addPlayer('player1', 'Alice', '/avatar1.png');
            game.addPlayer('player2', 'Bob', '/avatar2.png');
            game.addPlayer('player3', 'Charlie', '/avatar3.png');
            game.addPlayer('player4', 'Diana', '/avatar4.png');
            
            expect(game.isFull()).toBe(true);
        });

        test('should start game successfully with correct number of players', () => {
            // Add required players
            game.addPlayer('player1', 'Alice', '/avatar1.png');
            game.addPlayer('player2', 'Bob', '/avatar2.png');
            game.addPlayer('player3', 'Charlie', '/avatar3.png');
            game.addPlayer('player4', 'Diana', '/avatar4.png');
            
            const result = game.startGame();
            
            expect(result).toBe(true);
            expect(game.status).toBe(GameStatus.ACTIVE);
            expect(game.turnNumber).toBe(1);
            expect(game.currentPlayerIndex).toBe(0);
        });

        test('should not start game without correct number of players', () => {
            game.addPlayer('player1', 'Alice', '/avatar1.png');
            game.addPlayer('player2', 'Bob', '/avatar2.png');
            
            const result = game.startGame();
            
            expect(result).toBe(false);
            expect(game.status).toBe(GameStatus.WAITING);
        });

        test('should not start game that is already active', () => {
            // Add required players and start game
            game.addPlayer('player1', 'Alice', '/avatar1.png');
            game.addPlayer('player2', 'Bob', '/avatar2.png');
            game.addPlayer('player3', 'Charlie', '/avatar3.png');
            game.addPlayer('player4', 'Diana', '/avatar4.png');
            game.startGame();
            
            const result = game.startGame();
            
            expect(result).toBe(false);
            expect(game.status).toBe(GameStatus.ACTIVE);
        });

        test('should end game successfully', () => {
            game.endGame();
            
            expect(game.status).toBe(GameStatus.ENDED);
        });
    });

    describe('Turn Management', () => {
        beforeEach(() => {
            game.addPlayer('player1', 'Alice', '/avatar1.png');
            game.addPlayer('player2', 'Bob', '/avatar2.png');
            game.addPlayer('player3', 'Charlie', '/avatar3.png');
            game.addPlayer('player4', 'Diana', '/avatar4.png');
            game.startGame();
        });

        test('should get current player correctly', () => {
            const currentPlayer = game.getCurrentPlayer();
            
            expect(currentPlayer).toBeDefined();
            expect(currentPlayer.id).toBe(game.playerOrder[0]);
        });

        test('should move to next turn correctly', () => {
            const initialTurn = game.turnNumber;
            const initialPlayerIndex = game.currentPlayerIndex;
            
            game.nextTurn();
            
            expect(game.turnNumber).toBe(initialTurn + 1);
            expect(game.currentPlayerIndex).toBe((initialPlayerIndex + 1) % 4);
        });

        test('should cycle through players correctly', () => {
            const playerOrder = game.playerOrder;
            // First turn - player1
            expect(game.getCurrentPlayer().id).toBe(playerOrder[0]);
            
            // Second turn - player2
            game.nextTurn();
            expect(game.getCurrentPlayer().id).toBe(playerOrder[1]);
            
            // Third turn - player3
            game.nextTurn();
            expect(game.getCurrentPlayer().id).toBe(playerOrder[2]);
            
            // Fourth turn - player4
            game.nextTurn();
            expect(game.getCurrentPlayer().id).toBe(playerOrder[3]);
            
            // Fifth turn - back to player1
            game.nextTurn();
            expect(game.getCurrentPlayer().id).toBe(playerOrder[0]);
        });
    });

    describe('Game State Retrieval', () => {
        beforeEach(() => {
            game.addPlayer('player1', 'Alice', '/avatar1.png');
            game.addPlayer('player2', 'Bob', '/avatar2.png');
        });

        test('should get all players correctly', () => {
            const allPlayers = game.getAllPlayers();
            
            expect(allPlayers).toHaveLength(2);
            expect(allPlayers.map(p => p.name)).toContain('Alice');
            expect(allPlayers.map(p => p.name)).toContain('Bob');
        });

        test('should get game state summary correctly', () => {
            const gameState = game.getGameState();
            
            expect(gameState.id).toBe('test-game-1');
            expect(gameState.status).toBe(GameStatus.WAITING);
            expect(gameState.requiredPlayers).toBe(4);
            expect(gameState.playerOrder).toEqual(['player1', 'player2']);
            expect(gameState.currentPlayerIndex).toBe(0);
            expect(gameState.turnNumber).toBe(0);
            expect(gameState.players).toBeDefined();
            expect(gameState.npcDoggos).toBeDefined();
            expect(gameState.storeMarket).toBeDefined();
        });

        test('should get detailed game state correctly', () => {
            const detailedState = game.getGameState();
            
            expect(detailedState.id).toBe('test-game-1');
            expect(detailedState.status).toBe(GameStatus.WAITING);
            expect(detailedState.players).toBeDefined();
            expect(detailedState.npcDoggos).toBeDefined();
            expect(detailedState.storeMarket).toBeDefined();
        });
    });

    describe('toResponse', () => {
        test('test toResponse', () => {
            console.log("current test--------------------------------");
            game = new Game('test-game-toResponse', 2);
            game.addPlayer('player1', 'Alice', '/avatar1.png');
            game.addPlayer('player2', 'Bob', '/avatar2.png');
            game.startGame();

            const response = game.toResponse();
            console.dir(response, { depth: null });
            game.assignDoggoCardToCurrentPlayer(0);
            const response2 = game.toResponse();
            console.dir(response2, { depth: null });
            game.assignDoggoCardToCurrentPlayer(0);
            const response3 = game.toResponse();
            console.dir(response3, { depth: null });
            game.sellStoreCardToCurrentPlayer(0);
            game.currentPlayerBuildStore(0);
            game.assignDoggoCardToCurrentPlayer(0);
            const response4 = game.toResponse();
            console.dir(response4, { depth: null });
        });
    });
});

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { createGame, GameStatus } = require('../game/game.js');
const { createPlayer } = require('../game/players.js');
const dataBase = require('../services/dataService.js');

const router = express.Router();

/**
 * POST /create-game
 * Creates a new game instance
 * 
 * Request body:
 * {
 *   "numberOfPlayers": number
 * }
 * 
 * Response:
 * {
 *   "gameId": "string"
 * }
 */
router.post('/create-game', (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'Missing request body'
            });
        }

        const { numberOfPlayers } = req.body;

        // Validate required fields
        if (!numberOfPlayers) {
            return res.status(400).json({
                error: 'Missing required fields: numberOfPlayers'
            });
        }

        // Validate numberOfPlayers is a reasonable number
        if (typeof numberOfPlayers !== 'number' || numberOfPlayers < 2 || numberOfPlayers > 6) {
            return res.status(400).json({
                error: 'numberOfPlayers must be a number between 2 and 6'
            });
        }

        // Generate unique IDs
        const gameId = uuidv4();

        // Create new game instance
        const game = createGame(gameId, numberOfPlayers);

        // Store the game in memory
        dataBase.set(gameId, game);

        console.log(`Game created: ${gameId} with ${numberOfPlayers} players`);

        res.status(201).json({
            gameId: gameId
        });

    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({
            error: 'Internal server error while creating game'
        });
    }
});

/**
 * TODO: Create this route in the future if needed
 * 
 * POST /validate-game
 * Validates if a game exists and returns its status
 * 
 * Request body:
 * {
 *   "gameId": "string"
 * }
 * 
 * Response:
 * Status 200: Game exists and is joinable
 * Status 404: Game not found
 * Status 400: Game is full or has already started
 */

/**
 * GET /games
 * Retrieves a list of all games currently stored in memory
 * 
 * Response:
 * Status 200: Returns an array of game summaries
 */
router.get('/games', (req, res) => {
    try {
        const games = Array.from(memoryStore.values()).map(game => ({
            gameId: game.id,
            numberOfPlayers: game.requiredPlayers,
            status: game.status
        }));

        res.status(200).json(games);
    } catch (error) {
        console.error('Error retrieving games:', error);
        res.status(500).json({
            error: 'Internal server error while retrieving games'
        });
    }
});

module.exports = router; 
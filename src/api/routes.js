const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Game = require('../game/game.js');
const dataBase = require('../services/dataService.js');
const GameStatus = require('../game/gameStatus.js');

const router = express.Router();

//Uncomment to bypass CORS for local testing
router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

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
        const game = new Game(gameId, numberOfPlayers);

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
 * GET /game/:gameId
 * Retrieves a game by its ID
 * 
 * Response:
 * Status 200: Returns the game object
 * Status 404: Game not found
 */
router.get('/game/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    const game = dataBase.get(gameId);
    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }
    res.status(200).json(game);
});

router.post('/game/:gameId/join', (req, res) => {
    const gameId = req.params.gameId;
    const game = dataBase.get(gameId);
    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }
    if (game.status !== GameStatus.WAITING) {
        return res.status(400).json({ error: 'Game has already started' });
    }
    if (game.isFull()) {
        return res.status(400).json({ error: 'Game is full' });
    }
    let { playerName, avatar = null } = req.body;
    const playerId = uuidv4();

    if (!playerName || playerName.length === 0) {
        playerName = "Player-" + String(game.playerOrder.length + 1);
    }
    const success = game.addPlayer(playerId, playerName, avatar);
    if (!success) {
        return res.status(400).json({ error: 'Failed to add player' });
    }
    res.status(200).json({ playerId: playerId, playerSimpleId: game.playerIdToSimpleId[playerId], playerName: playerName, numberOfPlayers: game.requiredPlayers });
});

// // dev only
// router.get('/games', (req, res) => {
//     try {
//         const games = Array.from(dataBase.values()).map(game => ({
//             gameId: game.id,
//             numberOfPlayers: game.requiredPlayers,
//             status: game.status
//         }));

//         res.status(200).json(games);
//     } catch (error) {
//         console.error('Error retrieving games:', error);
//         res.status(500).json({
//             error: 'Internal server error while retrieving games'
//         });
//     }
// });

module.exports = router; 
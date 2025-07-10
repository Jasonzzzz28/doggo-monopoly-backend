import express, { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Game } from '../game/game';
import dataBase from '../services/dataService';
import { GameStatus } from '../game/gameStatus';
import { CreateGameRequest, CreateGameResponse, JoinGameRequest, JoinGameResponse } from '../types';

const router = Router();

//Uncomment to bypass CORS for local testing
router.use((req: Request, res: Response, next: NextFunction) => {
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
router.post('/create-game', (req: Request, res: Response): void => {
    try {
        if (!req.body) {
            res.status(400).json({
                error: 'Missing request body'
            });
            return;
        }

        const { numberOfPlayers }: CreateGameRequest = req.body;

        // Validate required fields
        if (!numberOfPlayers) {
            res.status(400).json({
                error: 'Missing required fields: numberOfPlayers'
            });
            return;
        }

        // Validate numberOfPlayers is a reasonable number
        if (typeof numberOfPlayers !== 'number' || numberOfPlayers < 2 || numberOfPlayers > 6) {
            res.status(400).json({
                error: 'numberOfPlayers must be a number between 2 and 6'
            });
            return;
        }

        // Generate unique IDs
        const gameId = uuidv4();

        // Create new game instance
        const game = new Game(gameId, numberOfPlayers);

        // Store the game in memory
        dataBase.set(gameId, game);

        console.log(`Game created: ${gameId} with ${numberOfPlayers} players`);

        const response: CreateGameResponse = {
            gameId: gameId
        };

        res.status(201).json(response);

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
router.get('/game/:gameId', (req: Request, res: Response): void => {
    const gameId = req.params.gameId;
    const game = dataBase.get(gameId) as Game;
    if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
    }
    res.status(200).json(game);
});

router.post('/game/:gameId/join', (req: Request, res: Response): void => {
    const gameId = req.params.gameId;
    const game = dataBase.get(gameId) as Game;
    if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
    }
    if (game.status !== GameStatus.WAITING) {
        res.status(400).json({ error: 'Game has already started' });
        return;
    }
    if (game.isFull()) {
        res.status(400).json({ error: 'Game is full' });
        return;
    }
    const { playerName, avatar = null }: JoinGameRequest = req.body;
    const playerId = uuidv4();

    const finalPlayerName = (!playerName || playerName.length === 0) 
        ? "Player-" + String(game.playerOrder.length + 1)
        : playerName;

    const success = game.addPlayer(playerId, finalPlayerName, avatar);
    if (!success) {
        res.status(400).json({ error: 'Failed to add player' });
        return;
    }

    const response: JoinGameResponse = {
        playerId: playerId,
        playerSimpleId: game.playerIdToSimpleId[playerId],
        playerName: finalPlayerName,
        numberOfPlayers: game.requiredPlayers
    };

    res.status(200).json(response);
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

export default router; 
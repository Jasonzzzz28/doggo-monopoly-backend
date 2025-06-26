const { Player, createPlayer } = require('./players.js');

/**
 * Game status enum
 */
const GameStatus = {
    WAITING: 'waiting',
    ACTIVE: 'active',
    ENDED: 'ended'
};

/**
 * Game class for Doggo Monopoly
 * Manages the overall game state, players, and game flow
 */
class Game {
    constructor(id, requiredPlayers) {
        this.id = id;                           // Unique game identifier
        this.status = GameStatus.WAITING;       // Game status: 'waiting', 'active', 'ended'
        this.requiredPlayers = requiredPlayers; // Exact number of players required to start
        this.players = {};                      // Object storing all players, indexed by player ID
        this.playerOrder = [];                  // Array of player IDs determining turn order
        this.currentPlayerIndex = 0;            // Index in playerOrder pointing to current player
        this.npcDoggos = {                      // NPC doggo cards management
            visible: [],                        // Up to 4 visible NPC doggo cards
            discardPile: [],                    // Discarded NPC doggo cards
            drawPile: []                        // NPC doggo cards to draw from
        };
        this.storeMarket = {                    // Store cards management
            visible: [],                        // Up to 4 visible store cards
            discardPile: [],                    // Discarded store cards
            drawPile: []                        // Store cards to draw from
        };
        this.turnNumber = 0;                    // Current turn number
        this.createdAt = Date.now();            // Timestamp when game was created
    }

    /**
     * Add a player to the game
     * @param {string} playerId - Unique player identifier
     * @param {string} playerName - Player's display name
     * @param {string} avatarPath - Path to player's avatar image
     * @returns {boolean} - True if player was added successfully
     */
    addPlayer(playerId, playerName, avatarPath) {
        if (this.players[playerId]) {
            return false; // Player already exists
        }

        if (this.playerOrder.length >= this.requiredPlayers) {
            return false; // Game is full
        }

        const player = createPlayer(playerId, playerName, avatarPath);
        this.players[playerId] = player;
        this.playerOrder.push(playerId);

        return true;
    }

    /**
     * Remove a player from the game
     * @param {string} playerId - ID of player to remove
     * @returns {boolean} - True if player was removed successfully
     */
    removePlayer(playerId) {
        if (!this.players[playerId]) {
            return false; // Player doesn't exist
        }

        // Remove player from players object
        delete this.players[playerId];

        // Remove player from player order
        const orderIndex = this.playerOrder.indexOf(playerId);
        if (orderIndex > -1) {
            this.playerOrder.splice(orderIndex, 1);
            
            // Adjust current player index if necessary
            if (this.currentPlayerIndex >= this.playerOrder.length) {
                this.currentPlayerIndex = 0;
            }
        }

        return true;
    }

    /**
     * Start the game
     * @returns {boolean} - True if game started successfully
     */
    startGame() {
        if (this.playerOrder.length !== this.requiredPlayers) {
            return false; // Need exactly the required number of players
        }

        if (this.status !== GameStatus.WAITING) {
            return false; // Game already started or ended
        }

        this.status = GameStatus.ACTIVE;
        this.turnNumber = 1;
        this.currentPlayerIndex = 0;

        // Initialize card piles (this would be populated with actual card data)
        this.initializeCardPiles();

        return true;
    }

    /**
     * End the game
     */
    endGame() {
        this.status = GameStatus.ENDED;
    }

    /**
     * Get the current player
     * @returns {Player|null} - Current player object or null if no players
     */
    getCurrentPlayer() {
        if (this.playerOrder.length === 0) {
            return null;
        }
        const currentPlayerId = this.playerOrder[this.currentPlayerIndex];
        return this.players[currentPlayerId];
    }

    /**
     * Move to the next player's turn
     */
    nextTurn() {
        if (this.playerOrder.length === 0) {
            return;
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.playerOrder.length;
        this.turnNumber++;
    }

    /**
     * Get a specific player by ID
     * @param {string} playerId - Player ID to find
     * @returns {Player|null} - Player object or null if not found
     */
    getPlayer(playerId) {
        return this.players[playerId] || null;
    }

    /**
     * Get all players as an array
     * @returns {Player[]} - Array of all players
     */
    getAllPlayers() {
        return Object.values(this.players);
    }

    /**
     * Get the number of players in the game
     * @returns {number} - Number of players
     */
    getPlayerCount() {
        return this.playerOrder.length;
    }

    /**
     * Check if the game is ready to start (has exact number of required players)
     * @returns {boolean} - True if game is ready to start
     */
    isReadyToStart() {
        return this.status === GameStatus.WAITING && this.playerOrder.length === this.requiredPlayers;
    }

    /**
     * Check if the game is full (has reached required number of players)
     * @returns {boolean} - True if game is full
     */
    isFull() {
        return this.playerOrder.length >= this.requiredPlayers;
    }

    /**
     * Initialize card piles with default cards
     * This would typically load from JSON files or database
     */
    initializeCardPiles() {
        // Initialize NPC doggo cards
        this.npcDoggos.drawPile = []; // Would be populated with actual doggo cards
        this.npcDoggos.visible = [];
        this.npcDoggos.discardPile = [];

        // Initialize store market cards
        this.storeMarket.drawPile = []; // Would be populated with actual store cards
        this.storeMarket.visible = [];
        this.storeMarket.discardPile = [];

        // Draw initial visible cards
        this.drawVisibleCards();
    }

    /**
     * Draw cards to make visible piles up to their maximum size
     */
    drawVisibleCards() {
        // Draw up to 4 visible NPC doggo cards
        while (this.npcDoggos.visible.length < 4 && this.npcDoggos.drawPile.length > 0) {
            const card = this.npcDoggos.drawPile.pop();
            this.npcDoggos.visible.push(card);
        }

        // Draw up to 4 visible store cards
        while (this.storeMarket.visible.length < 4 && this.storeMarket.drawPile.length > 0) {
            const card = this.storeMarket.drawPile.pop();
            this.storeMarket.visible.push(card);
        }
    }

    /**
     * Get a visible NPC doggo card by index
     * @param {number} index - Index of the card (0-3)
     * @returns {Object|null} - Card object or null if not found
     */
    getVisibleNpcDoggo(index) {
        return this.npcDoggos.visible[index] || null;
    }

    /**
     * Get a visible store card by index
     * @param {number} index - Index of the card (0-3)
     * @returns {Object|null} - Card object or null if not found
     */
    getVisibleStore(index) {
        return this.storeMarket.visible[index] || null;
    }

    /**
     * Remove a visible NPC doggo card and replace it
     * @param {number} index - Index of the card to remove
     * @returns {Object|null} - Removed card or null if not found
     */
    removeVisibleNpcDoggo(index) {
        if (index < 0 || index >= this.npcDoggos.visible.length) {
            return null;
        }

        const removedCard = this.npcDoggos.visible.splice(index, 1)[0];
        this.npcDoggos.discardPile.push(removedCard);

        // Draw a new card if available
        if (this.npcDoggos.drawPile.length > 0) {
            const newCard = this.npcDoggos.drawPile.pop();
            this.npcDoggos.visible.push(newCard);
        }

        return removedCard;
    }

    /**
     * Remove a visible store card and replace it
     * @param {number} index - Index of the card to remove
     * @returns {Object|null} - Removed card or null if not found
     */
    removeVisibleStore(index) {
        if (index < 0 || index >= this.storeMarket.visible.length) {
            return null;
        }

        const removedCard = this.storeMarket.visible.splice(index, 1)[0];
        this.storeMarket.discardPile.push(removedCard);

        // Draw a new card if available
        if (this.storeMarket.drawPile.length > 0) {
            const newCard = this.storeMarket.drawPile.pop();
            this.storeMarket.visible.push(newCard);
        }

        return removedCard;
    }

    /**
     * Get game state summary for client updates
     * @returns {Object} - Game state summary
     */
    getGameState() {
        return {
            id: this.id,
            status: this.status,
            requiredPlayers: this.requiredPlayers,
            playerOrder: this.playerOrder,
            currentPlayerIndex: this.currentPlayerIndex,
            turnNumber: this.turnNumber,
            createdAt: this.createdAt,
            players: Object.fromEntries(
                Object.entries(this.players).map(([id, player]) => [id, player.getSummary()])
            ),
            npcDoggos: {
                visible: this.npcDoggos.visible,
                discardPileCount: this.npcDoggos.discardPile.length,
                drawPileCount: this.npcDoggos.drawPile.length
            },
            storeMarket: {
                visible: this.storeMarket.visible,
                discardPileCount: this.storeMarket.discardPile.length,
                drawPileCount: this.storeMarket.drawPile.length
            }
        };
    }

    /**
     * Get detailed game state for debugging
     * @returns {Object} - Complete game state
     */
    getDetailedGameState() {
        return {
            id: this.id,
            status: this.status,
            requiredPlayers: this.requiredPlayers,
            players: this.players,
            playerOrder: this.playerOrder,
            currentPlayerIndex: this.currentPlayerIndex,
            npcDoggos: this.npcDoggos,
            storeMarket: this.storeMarket,
            turnNumber: this.turnNumber,
            createdAt: this.createdAt
        };
    }
}

/**
 * Create a new game instance
 * @param {string} id - Unique game identifier
 * @param {number} requiredPlayers - Exact number of players required to start
 * @returns {Game} - New game instance
 */
function createGame(id, requiredPlayers) {
    return new Game(id, requiredPlayers);
}

module.exports = {
    Game,
    createGame,
    GameStatus
};

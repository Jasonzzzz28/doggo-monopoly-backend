const { Player, createPlayer } = require('./player.js');
const { getRandomDoggoCards } = require('./doggoCards.js');
const { StoreTypes } = require('./storeTypes.js');
const { Store } = require('./store.js');

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
            drawPile: [],                       // NPC doggo cards to draw from
            extraMoney: [0, 0, 0, 0]            // Extra money attached to the 4 visible doggo cards
        };
        this.storeMarket = {                    // Store cards management
            visible: [],                        // Up to 4 visible store cards
            drawPile: []                        // Store cards to draw from
        };
        this.turnNumber = 0;                    // Current turn number
        this.createdAt = Date.now();            // Timestamp when game was created
    }

    /**
     * Add a player to the game
     * @param {string} playerId - Unique player identifier
     * @param {string} playerName - Player's display name
     * @param {string} avatar - Path to player's avatar image
     * @returns {boolean} - True if player was added successfully
     */
    addPlayer(playerId, playerName, avatar) {
        if (this.players[playerId]) {
            return false; // Player already exists
        }

        if (this.playerOrder.length >= this.requiredPlayers) {
            return false; // Game is full
        }

        const player = createPlayer(playerId, playerName, avatar);
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
        this.npcDoggos.visible = [];
        this.npcDoggos.discardPile = [];

        // Initialize store market cards
        this.storeMarket.visible = [];

        this.initializeDoggoCards();
        this.initializeStoreCards();
        // Draw initial visible cards
        this.drawVisibleCards();
    }

    initializeDoggoCards() {
        this.npcDoggos.drawPile = getRandomDoggoCards(6);
    }

    initializeStoreCards() {
        this.storeMarket.drawPile = this.setUpRandomStoreCards();
    }
    
    // TODO: Modify to use actual store cards when we have them
    setUpRandomStoreCards() {
        const storeTypes = Object.values(StoreTypes);
        const storeCards = [];

        // Create 3 store objects for each type
        storeTypes.forEach(type => {
            for (let i = 0; i < 3; i++) {
                storeCards.push(new Store(type, `${type}_${i}`));
            }
        });

        // Shuffle the store cards into random order
        for (let i = storeCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [storeCards[i], storeCards[j]] = [storeCards[j], storeCards[i]];
        }

        return storeCards;
    }

    drawStoreCard() {
        if (this.storeMarket.drawPile.length === 0) {
            return null;
        }
        const card = this.storeMarket.drawPile.pop();
        return card;
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

    sellStoreCardToPlayer(playerId, storeIndex) {
        const player = this.players[playerId];
        if (!player) {
            return false;
        }
        if (storeIndex < 0 || storeIndex >= this.storeMarket.visible.length) {
            return false;
        }
        const store = this.storeMarket.visible[storeIndex];
        if (!player.acquireStoreCard(store)) {
            return false;
        }
        this.storeMarket.visible.splice(storeIndex, 1);
        return true;
    }
    
    replaceStoreCard(playerId, storeIndex) {
        const player = this.players[playerId];
        if (!player) {
            return false;
        }
        if (storeIndex < 0 || storeIndex >= player.storeCards.length) {
            return false;
        }
        const newStore = this.drawStoreCard();
        if (!newStore) {
            return false;
        }
        player.storeCards[storeIndex] = newStore;
        return true;
    }

    assignDoggoCardToPlayer(playerId, doggoIndex) {
        const player = this.players[playerId];
        if (!player) {
            return false;
        }
        if (doggoIndex < 0 || doggoIndex >= this.npcDoggos.visible.length) {
            return false;
        }
        if (doggoIndex > 0) {
            const cost = ((doggoIndex + 1) * doggoIndex) / 2;
            if (player.getNetWorth() < cost) {
                return false;
            }
            player.removeMoney(cost);
            for (let i = 0; i < doggoIndex; i++) {
                this.npcDoggos.extraMoney[i] += i + 1;
            }
        }
        const doggo = this.npcDoggos.visible[doggoIndex];
        if (!player.acquireDoggoCard(doggo)) {
            return false;
        }
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

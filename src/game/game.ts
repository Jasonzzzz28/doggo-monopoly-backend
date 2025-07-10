import { GameStatus, GameState, GameResponse } from '../types';
import { Player } from './player';
import { getRandomDoggoCards } from './doggoCards';
import { StoreTypes } from './storeTypes';
import { Store } from './store';
import { Dish } from './dish';
import { DishTypes } from './dishTypes';

const MAX_VISIBLE_DOGGO_CARDS = 4;
const MAX_VISIBLE_STORE_CARDS = 4;
const WINNING_MONEY = 50;
const WINNING_BUILT_STORES = 8;
// TODO: Add limit for level 4 dishes if needed later
const MAX_NUM_OF_LEVEL_4_DISHES = 4;

/**
 * Game class for Doggo Monopoly
 * Manages the overall game state, players, and game flow
 */
export class Game {
    public id: string;
    public status: GameStatus;
    public requiredPlayers: number;
    public players: Record<string, Player>;
    public playerOrder: string[];
    public playerIdToSimpleId: Record<string, number>;
    public currentPlayerIndex: number;
    public npcDoggos: {
        visible: any[];
        discardPile: any[];
        drawPile: any[];
        extraMoney: number[];
    };
    public storeMarket: {
        visible: Store[];
        drawPile: Store[];
    };
    public turnNumber: number;
    public createdAt: number;
    public winnerIndex: number | null;

    constructor(id: string, requiredPlayers: number) {
        this.id = id;
        this.status = GameStatus.WAITING;
        this.requiredPlayers = requiredPlayers;
        this.players = {};
        this.playerOrder = [];
        this.playerIdToSimpleId = {};
        this.currentPlayerIndex = 0;
        this.npcDoggos = {
            visible: [],
            discardPile: [],
            drawPile: [],
            extraMoney: [0, 0, 0, 0]
        };
        this.storeMarket = {
            visible: [],
            drawPile: []
        };
        this.turnNumber = 0;
        this.createdAt = Math.floor(Date.now() / 1000);
        this.winnerIndex = null;
    }

    isCurrentPlayerWinner(): boolean {
        const currentPlayer = this.getCurrentPlayer();
        if (!currentPlayer) return false;
        return currentPlayer.getNetWorth() >= WINNING_MONEY 
        && currentPlayer.getNumOfStoreBuilt() === WINNING_BUILT_STORES;
    }

    /**
     * Add a player to the game
     * @param playerId - Unique player identifier
     * @param playerName - Player's display name
     * @param avatar - Path to player's avatar image
     * @returns True if player was added successfully
     */
    addPlayer(playerId: string, playerName: string, avatar: string | null): boolean {
        if (this.players[playerId]) {
            return false; // Player already exists
        }

        if (this.playerOrder.length >= this.requiredPlayers) {
            return false; // Game is full
        }

        const player = new Player(playerId, playerName, avatar);
        this.players[playerId] = player;
        this.playerOrder.push(playerId);
        this.playerIdToSimpleId[playerId] = this.playerOrder.length;

        return true;
    }

    /**
     * Remove a player from the game
     * @param playerId - ID of player to remove
     * @returns True if player was removed successfully
     */
    removePlayer(playerId: string): boolean {
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
     * @returns True if game started successfully
     */
    startGame(): boolean {
        if (this.playerOrder.length !== this.requiredPlayers) {
            return false; // Need exactly the required number of players
        }

        if (this.status !== GameStatus.WAITING) {
            return false; // Game already started or ended
        }

        this.status = GameStatus.ACTIVE;
        this.turnNumber = 1;
        this.currentPlayerIndex = 0;

        this.initializePlayers();
        this.initializeCardPiles();

        return true;
    }

    private initializePlayers(): void {
        this.playerOrder = this.playerOrder.sort(() => Math.random() - 0.5);
        if (this.playerOrder.length < 2) {
            return;
        }
        for (let i = 1; i < this.playerOrder.length; i++) {
            const playerId = this.playerOrder[i];
            const player = this.players[playerId];
            player.addMoney(i);
        }
    }

    /**
     * End the game
     */
    endGame(): void {
        this.status = GameStatus.ENDED;
        this.winnerIndex = this.currentPlayerIndex;
    }

    getCurrentPlayerId(): string | null {
        if (this.playerOrder.length === 0) {
            return null;
        }
        return this.playerOrder[this.currentPlayerIndex];
    }

    getCurrentPlayer(): Player | null {
        if (this.playerOrder.length === 0) {
            return null;
        }
        const currentPlayerId = this.playerOrder[this.currentPlayerIndex];
        return this.players[currentPlayerId];
    }

    /**
     * Move to the next player's turn
     */
    nextTurn(): void {
        if (this.playerOrder.length === 0) {
            return;
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.playerOrder.length;
        this.turnNumber++;
    }

    /**
     * Get a specific player by ID
     * @param playerId - Player ID to find
     * @returns Player object or null if not found
     */
    getPlayer(playerId: string): Player | null {
        return this.players[playerId] || null;
    }

    /**
     * Get all players as an array
     * @returns Array of all players
     */
    getAllPlayers(): Player[] {
        return Object.values(this.players);
    }

    /**
     * Get the number of players in the game
     * @returns Number of players
     */
    getPlayerCount(): number {
        return this.playerOrder.length;
    }

    /**
     * Check if the game is ready to start (has exact number of required players)
     * @returns True if game is ready to start
     */
    isReadyToStart(): boolean {
        return this.status === GameStatus.WAITING && this.playerOrder.length === this.requiredPlayers;
    }

    /**
     * Check if the game is full (has reached required number of players)
     * @returns True if game is full
     */
    isFull(): boolean {
        return this.playerOrder.length >= this.requiredPlayers;
    }

    /**
     * Initialize card piles with default cards
     * This would typically load from JSON files or database
     */
    private initializeCardPiles(): void {
        // Initialize NPC doggo cards
        this.npcDoggos.visible = [];
        this.npcDoggos.discardPile = [];

        // Initialize store market cards
        this.storeMarket.visible = [];

        this.initializeDoggoCards();
        this.initializeStoreCards();
        // Draw initial visible cards
        this.drawInitialVisibleCards();
    }

    private initializeDoggoCards(): void {
        this.npcDoggos.drawPile = getRandomDoggoCards(6);
    }

    private initializeStoreCards(): void {
        this.storeMarket.drawPile = this.setUpRandomStoreCards();
    }
    
    // TODO: Modify to use actual store cards when we have them
    private setUpRandomStoreCards(): Store[] {
        const storeTypes = Object.values(StoreTypes);
        const storeCards: Store[] = [];

        // Create 3 store objects for each type
        storeTypes.forEach(type => {
            for (let i = 0; i < 3; i++) {
                storeCards.push(new Store(type, `${type.type}_${i}`));
            }
        });

        // Shuffle the store cards into random order
        for (let i = storeCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [storeCards[i], storeCards[j]] = [storeCards[j], storeCards[i]];
        }

        return storeCards;
    }

    private drawStoreCard(): Store | null {
        if (this.storeMarket.drawPile.length === 0) {
            return null;
        }
        const card = this.storeMarket.drawPile.pop();
        return card || null;
    }

    private drawDoggoCard(): any | null {
        if (this.npcDoggos.drawPile.length === 0) {
            // Shuffle discard pile into draw pile
            this.npcDoggos.drawPile = this.npcDoggos.discardPile.sort(() => Math.random() - 0.5);
            this.npcDoggos.discardPile = [];
        }
        const card = this.npcDoggos.drawPile.pop();
        return card || null;
    }

    /**
     * Draw cards to make visible piles up to their maximum size
     */
    private drawInitialVisibleCards(): void {
        // Draw up to 4 visible NPC doggo cards
        while (this.npcDoggos.visible.length < MAX_VISIBLE_DOGGO_CARDS && this.npcDoggos.drawPile.length > 0) {
            const card = this.npcDoggos.drawPile.pop();
            if (card) {
                this.npcDoggos.visible.push(card);
            }
        }

        // Draw up to 4 visible store cards
        while (this.storeMarket.visible.length < MAX_VISIBLE_STORE_CARDS && this.storeMarket.drawPile.length > 0) {
            const card = this.storeMarket.drawPile.pop();
            if (card) {
                this.storeMarket.visible.push(card);
            }
        }
    }

    sellStoreCardToCurrentPlayer(storeIndex: number): boolean {
        const player = this.getCurrentPlayer();
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
        this.replaceVisibleStoreCard(storeIndex);
        return true;
    }
    
    private replaceVisibleStoreCard(storeIndex: number): boolean {
        if (storeIndex < 0 || storeIndex >= this.storeMarket.visible.length) {
            return false;
        }
        const newStore = this.drawStoreCard();
        if (!newStore) {
            return false;
        }
        this.storeMarket.visible[storeIndex] = newStore;
        return true;
    }

    currentPlayerBuildStore(index: number): boolean {
        const player = this.getCurrentPlayer();
        if (!player) {
            return false;
        }
        return player.buildStore(index);
    }

    assignDoggoCardToCurrentPlayer(doggoIndex: number): boolean {
        const player = this.getCurrentPlayer();
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
        const extraMoney = this.npcDoggos.extraMoney[doggoIndex];
        player.hostDoggoCard(doggo, extraMoney);
        this.replaceVisibleDoggoCard(doggoIndex);
        this.npcDoggos.extraMoney[doggoIndex] = 0;
        this.npcDoggos.discardPile.push(doggo);

        if (this.isCurrentPlayerWinner()) {
            this.endGame();
        }
        this.nextTurn();

        return true;
    }

    private replaceVisibleDoggoCard(doggoIndex: number): boolean {
        if (doggoIndex < 0 || doggoIndex >= this.npcDoggos.visible.length) {
            return false;
        }
        const newDoggo = this.drawDoggoCard();
        if (!newDoggo) {
            return false;
        }
        this.npcDoggos.visible[doggoIndex] = newDoggo;
        return true;
    }

    sellDishCardToCurrentPlayer(dishType: any): boolean {
        const player = this.getCurrentPlayer();
        if (!player) {
            return false;
        }
        if (!Object.values(DishTypes).includes(dishType)) {
            return false;
        }
        if (player.getNetWorth() < dishType.build_cost) {
            return false;
        }
        // TODO: Add limit for level 4 dishes if needed later
        player.removeMoney(dishType.build_cost);
        player.addDishCard(new Dish(dishType));
        return true;
    }

    currentPlayerRemoveDishCard(dishIndex: number): boolean {
        const player = this.getCurrentPlayer();
        if (!player) {
            return false;
        }
        return player.removeDishCardFromDiscardPile(dishIndex);
    }

    /**
     * For testing purposes only
     * @returns Game state summary
     */
    getGameState(): GameState {
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
                visible: this.storeMarket.visible.map(store => store.toResponse()),
                drawPileCount: this.storeMarket.drawPile.length
            }
        };
    }

    getWaitingRoomSummary(): string {
        return JSON.stringify(Object.entries(this.players).reduce((acc: Record<string, any>, [playerId, player]) => { 
            acc[this.playerIdToSimpleId[playerId]] = player.getWaitingRoomSummary();
            return acc;
        }, {}));
    }

    toResponse(): string {
        return JSON.stringify({
            id: this.id,
            status: this.status,
            requiredPlayers: this.requiredPlayers,
            // simple ids are for client-side use
            players: Object.entries(this.players).reduce((acc: Record<string, any>, [playerId, player]) => { 
                acc[this.playerIdToSimpleId[playerId].toString()] = player.toResponse();
                return acc;
            }, {}),
            playerOrder: this.playerOrder.map(playerId => this.playerIdToSimpleId[playerId].toString()),
            currentPlayerIndex: this.currentPlayerIndex,
            npcDoggos: {
                visible: this.npcDoggos.visible.map((doggo: any) => doggo.id),
                discardPile: this.npcDoggos.discardPile.map((doggo: any) => doggo.id),
                extraMoney: this.npcDoggos.extraMoney
            },
            storeMarket: {
                visible: this.storeMarket.visible.map(store => store.toResponse())
            },
            turnNumber: this.turnNumber,
            createdAt: this.createdAt
        });
    }
} 
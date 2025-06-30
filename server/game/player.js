const Store = require('./store');
const Dish = require('./dish');
const { DoggoCards, DoggoCardData } = require('./doggoCards');

const defaultMoney = 5;
// TODO: Modify to use individual dish cards when we have them
const defaultDishCards = ["level-1", "level-1", "level-1", "level-1", "level-1", "level-1", "level-2", "level-2"];
const defaultDrawPile = ["level-1", "level-1", "level-1", "level-1", "level-1", "level-1", "level-2", "level-2"];

class Player {
    constructor(id, name, avatar) {
        this.id = id;                           // Unique player identifier
        this.name = name;                       // Player's display name
        this.avatar = avatar;                   // Path to player's avatar image
        this.storeCards = [];                   // List of store card IDs owned by player
        this.dishCards = defaultDishCards;                    // List of dish card IDs owned by player
        this.money = defaultMoney;                      // Player's current money (starting amount)
        this.drawPile = defaultDrawPile;                // Cards in player's draw pile
        this.discardPile = [];                  // Cards in player's discard pile
    }

    /**
     * Acquire a store card from the store market
     * @param {Store} store - The store card to acquire
     * @returns {boolean} - True if successful, false if insufficient funds
     */
    acquireStoreCard(store) {
        const cost = store.getCost();
        if (this.money >= cost) {
            this.money -= cost;
            this.storeCards.push(store);
            return true;
        }
        return false;
    }

    /**
     * Host a doggo card
     * @param {DoggoCards} doggo - The doggo card to host
     * @returns {boolean} - True if successful
     */
    hostDoggoCard(doggo) {
        return true;
    }

    /**
     * Add a dish card to player's collection
     * @param {Dish} dish - The dish card to add
     */
    addDishCard(dish) {
        this.dishCards.push(dish);
    }

    /**
     * Remove a dish card from player's collection
     * @param {Dish} dish - The dish card to remove
     * @returns {boolean} - True if card was removed, false if not found
     */
    removeDishCard(dish) {
        const index = this.dishCards.indexOf(dish);
        if (index > -1) {
            this.dishCards.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Add money to player's balance
     * @param {number} amount - Amount to add
     */
    addMoney(amount) {
        this.money += amount;
    }

    /**
     * Remove money from player's balance
     * @param {number} amount - Amount to remove
     * @returns {boolean} - True if successful, false if insufficient funds
     */
    removeMoney(amount) {
        if (this.money >= amount) {
            this.money -= amount;
            return true;
        }
        return false;
    }

    /**
     * Draw a card from the draw pile
     * @returns {Dish|Store|null} - The card or null if draw pile is empty
     */
    drawCard() {
        if (this.drawPile.length === 0) {
            this.shuffleDiscardIntoDraw();
        }
        return this.drawPile.length > 0 ? this.drawPile.pop() : null;
    }

    /**
     * Add a card to the discard pile
     * @param {Dish|Store} card - The card to discard
     */
    addToDiscardPile(card) {
        this.discardPile.push(card);
    }

    /**
     * Shuffle the discard pile back into the draw pile
     */
    shuffleDiscardIntoDraw() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.discardPile.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.discardPile[i], this.discardPile[j]] = [this.discardPile[j], this.discardPile[i]];
        }
        
        // Move all cards from discard to draw pile
        this.drawPile.push(...this.discardPile);
        this.discardPile = [];
    }

    /**
     * Get player's total net worth (money)
     * @returns {number} - Total net worth
     */
    getNetWorth() {
        return this.money;
    }

    /**
     * Get a summary of the player's current state
     * @returns {Object} - Player summary object
     */
    getSummary() {
        return {
            id: this.id,
            name: this.name,
            avatar: this.avatar,
            money: this.money,
            storeCardCount: this.storeCards.length,
            dishCardCount: this.dishCards.length,
            drawPileCount: this.drawPile.length,
            discardPileCount: this.discardPile.length
        };
    }

    /**
     * Get a minimal summary for waiting room display
     * @returns {Object} - Player waiting room summary with only name and avatar
     */
    getWaitingRoomSummary() {
        return {
            name: this.name,
            avatar: this.avatar
        };
    }
}

// Example player creation function
function createPlayer(id, name, avatar) {
    return new Player(id, name, avatar);
}

// Export the Player class and helper function
module.exports = {
    Player,
    createPlayer
};

const Store = require('./store');
const Dish = require('./dish');
const DishTypes = require('./dishTypes');
const { DoggoCards } = require('./doggoCards');

const defaultMoney = 5;

class Player {
    constructor(id, name, avatar) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.storeCards = [];
        this.dishCards = this.createDefaultDishCards();
        this.money = defaultMoney;
        this.dishCardsDrawPile = this.createDefaultDishCards();
        this.dishCardsDiscardPile = [];
    }

    /********** TEMPORARY METHODS **********/

    // TODO: Modify to use individual dish cards when we have them
    createDefaultDishCards() {
        return [new Dish(DishTypes.LEVEL_1), new Dish(DishTypes.LEVEL_1), new Dish(DishTypes.LEVEL_1), new Dish(DishTypes.LEVEL_1), new Dish(DishTypes.LEVEL_1), new Dish(DishTypes.LEVEL_1), new Dish(DishTypes.LEVEL_2), new Dish(DishTypes.LEVEL_2)];
    }

    /**
     * Acquire a store card from the store market
     * @param {Store} store - The store card to acquire
     * @returns {boolean} - True if successful, false if insufficient funds
     */
    acquireStoreCard(store) {
        if (this.storeCards.length == 8) {
            return false;
        }

        cost = this.storeCards.length + 1;
        if (this.storeCards.length == 0) {
            cost = 0;
        }
        if (this.storeCards.length >= 4) {
            cost += 2;
        }
        if (this.money >= cost) {
            this.money -= cost;
            this.storeCards.push(store);
            return true;
        }
        return false;
    }

    /********** PUBLIC METHODS **********/

    buildStore(storeIndex) {
        if (storeIndex < 0 || storeIndex >= this.storeCards.length) {
            return false;
        }
        const store = this.storeCards[storeIndex];
        if (store.isBuilt()) {
            return false;
        }
        if (this.money < store.getCost()) {
            return false;
        }
        this.money -= store.getCost();
        store.build();
        return true;
    }

    /**
     * Host a doggo card
     * @param {DoggoCards} doggo - The doggo card to host
     * @param {number} extraMoney - Extra money to add to player's balance
     */
    hostDoggoCard(doggo, extraMoney=0) {
        this.money += extraMoney;
        for (let i = 0; i < doggo.dishes_eaten; i++) {
            const dish = this.drawDishCard();
            this.money += dish.getIncome();
            this.dishCardsDiscardPile.push(dish);
        }
        this.storeCards.forEach(store => {
            // TODO: Add special effect for store later
            if (store.isBuilt() && doggo.stores_visited.includes(store.getType())) {
                this.money += store.getIncome();
            }
        });
    }

    /**
     * Add a dish card to player's collection
     * @param {Dish} dish - The dish card to add
     */
    addDishCard(dish) {
        this.dishCards.push(dish);
    }

    /**
     * Remove a dish card from player's discard pile
     * @param {number} index - The index of the dish card to remove
     * @returns {boolean} - True if card was removed
     */
    removeDishCardFromDiscardPile(index) {
        if (index > -1 && index < this.dishCardsDiscardPile.length) {
            this.dishCardsDiscardPile.splice(index, 1);
            return true;
        }
        return false;
    }

    /********** PRIVATE METHODS **********/
    
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
     * @returns {Dish} - The card or null if draw pile is empty
     */
    drawDishCard() {
        if (this.dishCardsDrawPile.length === 0) {
            this.shuffleDiscardIntoDraw();
        }
        return this.dishCardsDrawPile.length > 0 ? this.dishCardsDrawPile.pop() : null;
    }

    /**
     * Shuffle the discard pile back into the draw pile
     */
    shuffleDiscardIntoDraw() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.dishCardsDiscardPile.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.dishCardsDiscardPile[i], this.dishCardsDiscardPile[j]] = [this.dishCardsDiscardPile[j], this.dishCardsDiscardPile[i]];
        }
        
        // Move all cards from discard to draw pile
        this.dishCardsDrawPile.push(...this.dishCardsDiscardPile);
        this.dishCardsDiscardPile = [];
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
            dishCardsDrawPileCount: this.dishCardsDrawPile.length,
            dishCardsDiscardPileCount: this.dishCardsDiscardPile.length
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

// Export the Player class
module.exports = Player;
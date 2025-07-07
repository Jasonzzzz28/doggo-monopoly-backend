const Store = require('./store');
const Dish = require('./dish');
const { StoreTypes } = require('./storeTypes');
const { DishTypes } = require('./dishTypes');
const { DoggoCards } = require('./doggoCards');
const SpecialEffect = require('./specialEffect');

const defaultMoney = 5;

class Player {
    constructor(id, name, avatar) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.numOfStoreBuilt = 0;
        this.storeCards = [];
        this.dishCards = this.createDefaultDishCards();
        this.money = defaultMoney;
        this.dishCardsDrawPile = this.createDefaultDishCards();
        this.dishCardsDiscardPile = [];
        this.extraStoreEarnings = new Map(Object.entries(StoreTypes).map(([key, value]) => [value.type, 0]));
    }

    /********** TEMPORARY METHODS **********/

    // TODO: Modify to use individual dish cards when we have them
    createDefaultDishCards() {
        return [new Dish(DishTypes.LEVEL_1), new Dish(DishTypes.LEVEL_1), new Dish(DishTypes.LEVEL_1), new Dish(DishTypes.LEVEL_1), new Dish(DishTypes.LEVEL_1), new Dish(DishTypes.LEVEL_1), new Dish(DishTypes.LEVEL_2), new Dish(DishTypes.LEVEL_2)];
    }

    /********** PUBLIC METHODS **********/

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

    getNumOfStoreBuilt() {
        return this.numOfStoreBuilt;
    }

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
        this.numOfStoreBuilt++;

        switch (store.getSpecialEffect()) {
            case SpecialEffect.ICE_CREAM_PARLOR_PLUS_TWO_COINS:
                this.extraStoreEarnings[StoreTypes.ICE_CREAM_PARLOR] += 2;
                break;
            case SpecialEffect.DOG_BAR_DOG_PARK_SWIMMING_POOL_PLUS_ONE_COIN:
                this.extraStoreEarnings[StoreTypes.DOG_BAR] += 1;
                this.extraStoreEarnings[StoreTypes.DOG_PARK] += 1;
                this.extraStoreEarnings[StoreTypes.SWIMMING_POOL] += 1;
                break;
            case SpecialEffect.TOY_SHOP_PLUS_TWO_COINS:
                this.extraStoreEarnings[StoreTypes.TOY_SHOP] += 2;
                break;
            case SpecialEffect.PET_HOTEL_TREAT_CAFE_PET_FINE_DINING_PLUS_ONE_COIN:
                this.extraStoreEarnings[StoreTypes.PET_HOTEL] += 1;
                this.extraStoreEarnings[StoreTypes.TREAT_CAFE] += 1;
                this.extraStoreEarnings[StoreTypes.PET_FINE_DINING] += 1;
                break;
            case SpecialEffect.BONE_BAKERY_PLUS_TWO_COINS:
                this.extraStoreEarnings[StoreTypes.BONE_BAKERY] += 2;
                break;
        }
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
            this.drawDishCard();
        }
        this.storeCards.forEach(store => {
            if (store.isBuilt() && doggo.stores_visited.includes(store.getType())) {
                this.money += store.getIncome() + this.extraStoreEarnings.get(store.getType().type);
                switch (store.getSpecialEffect()) {
                    case SpecialEffect.DICE_ROLL:
                        this.money += Math.floor(Math.random() * 6) + 1;
                        break;
                    case SpecialEffect.DRAW_EXTRA_TWO_DOGGO_CARDS:
                        this.drawDishCard();
                        this.drawDishCard();
                        break;
                    case SpecialEffect.EARN_MONEY_AS_AMOUNT_DISHES_EATEN:
                        this.money += doggo.dishes_eaten;
                        break;
                    case SpecialEffect.EARN_MONEY_AS_AMOUNT_BUILT_STORES:
                        this.money += this.numOfStoreBuilt;
                        break;
                }
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
        const dish = this.dishCardsDrawPile.pop();
        if (!dish) {
            return null;
        }
        this.money += dish.getIncome();
        this.dishCardsDiscardPile.push(dish);
        return dish;
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

    toResponse() {
        return {
            id: this.id,
            name: this.name,
            avatar: this.avatar,
            numOfStoreBuilt: this.numOfStoreBuilt,
            storeCards: this.storeCards.map(store => store.toResponse()),
            dishCards: this.dishCards.map(dish => dish.toResponse()),
            money: this.money,
            dishCardsDiscardPile: this.dishCardsDiscardPile.map(dish => dish.toResponse()),
            extraStoreEarnings: Object.fromEntries(this.extraStoreEarnings)
        };
    }
}

// Export the Player class
module.exports = Player;
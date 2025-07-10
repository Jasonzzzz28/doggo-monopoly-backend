import { StoreType, SpecialEffect, WaitingRoomSummary, PlayerResponse } from '../types';
import { Store } from './store';
import { Dish } from './dish';
import { StoreTypes } from './storeTypes';
import { DishTypes } from './dishTypes';
import { DoggoCards } from './doggoCards';
import { SpecialEffect as SpecialEffectEnum } from './specialEffect';

const defaultMoney = 5;

export class Player {
    private id: string;
    private name: string;
    private avatar: string | null;
    private numOfStoreBuilt: number;
    private storeCards: Store[];
    private dishCards: Dish[];
    private money: number;
    private dishCardsDrawPile: Dish[];
    private dishCardsDiscardPile: Dish[];
    private extraStoreEarnings: Map<string, number>;

    constructor(id: string, name: string, avatar: string | null = null) {
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
    private createDefaultDishCards(): Dish[] {
        return [
            new Dish(DishTypes.LEVEL_1), 
            new Dish(DishTypes.LEVEL_1), 
            new Dish(DishTypes.LEVEL_1), 
            new Dish(DishTypes.LEVEL_1), 
            new Dish(DishTypes.LEVEL_1), 
            new Dish(DishTypes.LEVEL_1), 
            new Dish(DishTypes.LEVEL_2), 
            new Dish(DishTypes.LEVEL_2)
        ];
    }

    /********** PUBLIC METHODS **********/

    /**
     * Acquire a store card from the store market
     * @param store - The store card to acquire
     * @returns True if successful, false if insufficient funds
     */
    acquireStoreCard(store: Store): boolean {
        if (this.storeCards.length === 8) {
            return false;
        }

        let cost = this.storeCards.length + 1;
        if (this.storeCards.length === 0) {
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

    getNumOfStoreBuilt(): number {
        return this.numOfStoreBuilt;
    }

    buildStore(storeIndex: number): boolean {
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
            case SpecialEffectEnum.ICE_CREAM_PARLOR_PLUS_TWO_COINS:
                this.extraStoreEarnings.set(StoreTypes.ICE_CREAM_PARLOR.type, (this.extraStoreEarnings.get(StoreTypes.ICE_CREAM_PARLOR.type) || 0) + 2);
                break;
            case SpecialEffectEnum.DOG_BAR_DOG_PARK_SWIMMING_POOL_PLUS_ONE_COIN:
                this.extraStoreEarnings.set(StoreTypes.DOG_BAR.type, (this.extraStoreEarnings.get(StoreTypes.DOG_BAR.type) || 0) + 1);
                this.extraStoreEarnings.set(StoreTypes.DOG_PARK.type, (this.extraStoreEarnings.get(StoreTypes.DOG_PARK.type) || 0) + 1);
                this.extraStoreEarnings.set(StoreTypes.SWIMMING_POOL.type, (this.extraStoreEarnings.get(StoreTypes.SWIMMING_POOL.type) || 0) + 1);
                break;
            case SpecialEffectEnum.TOY_SHOP_PLUS_TWO_COINS:
                this.extraStoreEarnings.set(StoreTypes.TOY_SHOP.type, (this.extraStoreEarnings.get(StoreTypes.TOY_SHOP.type) || 0) + 2);
                break;
            case SpecialEffectEnum.PET_HOTEL_TREAT_CAFE_PET_FINE_DINING_PLUS_ONE_COIN:
                this.extraStoreEarnings.set(StoreTypes.PET_HOTEL.type, (this.extraStoreEarnings.get(StoreTypes.PET_HOTEL.type) || 0) + 1);
                this.extraStoreEarnings.set(StoreTypes.TREAT_CAFE.type, (this.extraStoreEarnings.get(StoreTypes.TREAT_CAFE.type) || 0) + 1);
                this.extraStoreEarnings.set(StoreTypes.PET_FINE_DINING.type, (this.extraStoreEarnings.get(StoreTypes.PET_FINE_DINING.type) || 0) + 1);
                break;
            case SpecialEffectEnum.BONE_BAKERY_PLUS_TWO_COINS:
                this.extraStoreEarnings.set(StoreTypes.BONE_BAKERY.type, (this.extraStoreEarnings.get(StoreTypes.BONE_BAKERY.type) || 0) + 2);
                break;
        }
        return true;
    }

    /**
     * Host a doggo card
     * @param doggo - The doggo card to host
     * @param extraMoney - Extra money to add to player's balance
     */
    hostDoggoCard(doggo: any, extraMoney: number = 0): void {
        this.money += extraMoney;
        for (let i = 0; i < doggo.dishes_eaten; i++) {
            this.drawDishCard();
        }
        this.storeCards.forEach(store => {
            if (store.isBuilt() && doggo.stores_visited.includes(store.getType())) {
                this.money += store.getIncome() + (this.extraStoreEarnings.get(store.getType().type) || 0);
                switch (store.getSpecialEffect()) {
                    case SpecialEffectEnum.DICE_ROLL:
                        this.money += Math.floor(Math.random() * 6) + 1;
                        break;
                    case SpecialEffectEnum.DRAW_EXTRA_TWO_DOGGO_CARDS:
                        this.drawDishCard();
                        this.drawDishCard();
                        break;
                    case SpecialEffectEnum.EARN_MONEY_AS_AMOUNT_DISHES_EATEN:
                        this.money += doggo.dishes_eaten;
                        break;
                    case SpecialEffectEnum.EARN_MONEY_AS_AMOUNT_BUILT_STORES:
                        this.money += this.numOfStoreBuilt;
                        break;
                }
            }
        });
    }

    /**
     * Add a dish card to player's collection
     * @param dish - The dish card to add
     */
    addDishCard(dish: Dish): void {
        this.dishCards.push(dish);
    }

    /**
     * Remove a dish card from player's discard pile
     * @param index - The index of the dish card to remove
     * @returns True if card was removed
     */
    removeDishCardFromDiscardPile(index: number): boolean {
        if (index > -1 && index < this.dishCardsDiscardPile.length) {
            this.dishCardsDiscardPile.splice(index, 1);
            return true;
        }
        return false;
    }

    /********** PRIVATE METHODS **********/
    
    /**
     * Add money to player's balance
     * @param amount - Amount to add
     */
    addMoney(amount: number): void {
        this.money += amount;
    }

    /**
     * Remove money from player's balance
     * @param amount - Amount to remove
     * @returns True if successful, false if insufficient funds
     */
    removeMoney(amount: number): boolean {
        if (this.money >= amount) {
            this.money -= amount;
            return true;
        }
        return false;
    }

    /**
     * Draw a card from the draw pile
     * @returns The card or null if draw pile is empty
     */
    drawDishCard(): Dish | null {
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
    private shuffleDiscardIntoDraw(): void {
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
     * @returns Total net worth
     */
    getNetWorth(): number {
        return this.money;
    }

    /**
     * Get a summary of the player's current state
     * @returns Player summary object
     */
    getSummary(): { id: string; name: string; avatar: string | null; money: number; storeCardCount: number; dishCardCount: number; dishCardsDrawPileCount: number; dishCardsDiscardPileCount: number } {
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
     * @returns Player waiting room summary with only name and avatar
     */
    getWaitingRoomSummary(): WaitingRoomSummary {
        return {
            name: this.name,
            avatar: this.avatar
        };
    }

    toResponse(): PlayerResponse {
        return {
            name: this.name,
            avatar: this.avatar,
            numOfStoreBuilt: this.numOfStoreBuilt,
            storeCards: this.storeCards.map(store => store.toResponse()),
            dishCards: this.dishCards.map(dish => dish.toResponse()),
            money: this.money,
            dishCardsDrawPileLength: this.dishCardsDrawPile.length,
            dishCardsDiscardPileLength: this.dishCardsDiscardPile.length,
            dishCardsDiscardPile: this.dishCardsDiscardPile.map(dish => dish.toResponse()),
            extraStoreEarnings: Object.fromEntries(this.extraStoreEarnings)
        };
    }
} 
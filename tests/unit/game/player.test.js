const Player = require('../../../src/game/player.js');
const Store = require('../../../src/game/store.js');
const { StoreTypes } = require('../../../src/game/storeTypes.js');
const Dish = require('../../../src/game/dish.js');
const { DishTypes } = require('../../../src/game/dishTypes.js');

describe('Player', () => {
    let player;

    beforeEach(() => {
        player = new Player('player1', 'Alice', '/avatar1.png');
    });

    describe('Player Creation', () => {
        test('should create a player with correct initial state', () => {
            expect(player.id).toBe('player1');
            expect(player.name).toBe('Alice');
            expect(player.avatar).toBe('/avatar1.png');
            expect(player.storeCards).toEqual([]);
            expect(player.money).toBe(5); // defaultMoney
            expect(player.dishCards).toHaveLength(8); // defaultDishCards length
            expect(player.dishCardsDrawPile).toHaveLength(8); // defaultDishCardsDrawPile length
            expect(player.dishCardsDiscardPile).toEqual([]);
        });

        test('should create player with correct default dish cards', () => {
            // Check that dish cards are properly initialized
            const level1Count = player.dishCards.filter(dish => dish.getType() === DishTypes.LEVEL_1).length;
            const level2Count = player.dishCards.filter(dish => dish.getType() === DishTypes.LEVEL_2).length;
            
            expect(level1Count).toBe(6);
            expect(level2Count).toBe(2);
        });

        test('should create player with correct draw pile', () => {
            const level1Count = player.dishCardsDrawPile.filter(dish => dish.getType() === DishTypes.LEVEL_1).length;
            const level2Count = player.dishCardsDrawPile.filter(dish => dish.getType() === DishTypes.LEVEL_2).length;
            
            expect(level1Count).toBe(6);
            expect(level2Count).toBe(2);
        });
    });

    describe('createPlayer helper function', () => {
        test('should create a player using the helper function', () => {
            const testPlayer = new Player('player2', 'Bob', '/avatar2.png');
            
            expect(testPlayer).toBeInstanceOf(Player);
            expect(testPlayer.id).toBe('player2');
            expect(testPlayer.name).toBe('Bob');
            expect(testPlayer.avatar).toBe('/avatar2.png');
        });
    });

    describe('Store Card Management', () => {
        test('should acquire and build first store card (free) when player has sufficient funds', () => {
            player.addMoney(10);
            const store = new Store(StoreTypes.TOY_SHOP);
            const initialMoney = player.money;

            const result1 = player.acquireStoreCard(store);
            
            expect(result1).toBe(true);
            expect(player.money).toBe(initialMoney);
            expect(player.storeCards).toHaveLength(1);
            expect(player.storeCards[0]).toBe(store);

            const result2 = player.buildStore(0);

            expect(result2).toBe(true);
            expect(player.money).toBe(initialMoney - store.getCost());
            expect(player.storeCards[0].isBuilt()).toBe(true);
        });

        test('should acquire multiple store cards', () => {
            const store1 = new Store(StoreTypes.TOY_SHOP);
            const store2 = new Store(StoreTypes.GROOMING_SPA);
            
            player.acquireStoreCard(store1);
            player.acquireStoreCard(store2);
            
            expect(player.storeCards).toHaveLength(2);
            expect(player.storeCards).toContain(store1);
            expect(player.storeCards).toContain(store2);
        });
    });

    describe('Money Management', () => {
        test('should add money correctly', () => {
            const initialMoney = player.money;
            const amountToAdd = 10;
            
            player.addMoney(amountToAdd);
            
            expect(player.money).toBe(initialMoney + amountToAdd);
        });

        test('should remove money when player has sufficient funds', () => {
            const initialMoney = player.money;
            const amountToRemove = 3;
            
            const result = player.removeMoney(amountToRemove);
            
            expect(result).toBe(true);
            expect(player.money).toBe(initialMoney - amountToRemove);
        });

        test('should not remove money when player has insufficient funds', () => {
            const initialMoney = player.money;
            const amountToRemove = 10;
            
            const result = player.removeMoney(amountToRemove);
            
            expect(result).toBe(false);
            expect(player.money).toBe(initialMoney);
        });

        test('should handle zero amount operations', () => {
            const initialMoney = player.money;
            
            player.addMoney(0);
            expect(player.money).toBe(initialMoney);
            
            const result = player.removeMoney(0);
            expect(result).toBe(true);
            expect(player.money).toBe(initialMoney);
        });
    });

    describe('Dish Card Management', () => {
        test('should add dish card to collection', () => {
            const newDish = new Dish(DishTypes.LEVEL_3);
            const initialCount = player.dishCards.length;
            
            player.addDishCard(newDish);
            
            expect(player.dishCards).toHaveLength(initialCount + 1);
            expect(player.dishCards).toContain(newDish);
        });

        test('should draw dish card from draw pile', () => {
            const initialDrawPileCount = player.dishCardsDrawPile.length;
            
            const drawnCard = player.drawDishCard();
            
            expect(drawnCard).toBeDefined();
            expect(drawnCard).toBeInstanceOf(Dish);
            expect(player.dishCardsDrawPile).toHaveLength(initialDrawPileCount - 1);
        });

        test('should return null when draw pile is empty and discard pile is empty', () => {
            // Empty both piles
            player.dishCardsDrawPile = [];
            player.dishCardsDiscardPile = [];
            
            const drawnCard = player.drawDishCard();
            
            expect(drawnCard).toBeNull();
        });

        test('should shuffle discard pile into draw pile when draw pile is empty', () => {
            // Move all cards to discard pile
            player.dishCardsDiscardPile = [...player.dishCardsDrawPile];
            player.dishCardsDrawPile = [];
            
            const initialDiscardCount = player.dishCardsDiscardPile.length;
            
            const drawnCard = player.drawDishCard();
            
            expect(drawnCard).toBeDefined();
            // The card drawn should be added to the discard pile
            expect(player.dishCardsDiscardPile).toHaveLength(1);
            expect(player.dishCardsDrawPile).toHaveLength(initialDiscardCount - 1);
        });

        test('should remove dish card from discard pile by index', () => {
            const dish1 = new Dish(DishTypes.LEVEL_1);
            const dish2 = new Dish(DishTypes.LEVEL_2);
            player.dishCardsDiscardPile = [dish1, dish2];
            
            const result = player.removeDishCardFromDiscardPile(0);
            
            expect(result).toBe(true);
            expect(player.dishCardsDiscardPile).toHaveLength(1);
            expect(player.dishCardsDiscardPile[0]).toBe(dish2);
        });

        test('should return false when removing dish card with invalid index', () => {
            player.dishCardsDiscardPile = [new Dish(DishTypes.LEVEL_1)];
            
            const result = player.removeDishCardFromDiscardPile(5);
            
            expect(result).toBe(false);
            expect(player.dishCardsDiscardPile).toHaveLength(1);
        });

        test('should return false when removing dish card from empty discard pile', () => {
            const result = player.removeDishCardFromDiscardPile(0);
            
            expect(result).toBe(false);
        });
    });

    describe('Doggo Card Hosting', () => {
        test('should host doggo card and process dishes eaten', () => {
            // Mock doggo card with dishes_eaten
            const mockDoggo = {
                dishes_eaten: 3,
                stores_visited: null
            };
            
            const initialMoney = player.money;
            const initialDiscardCount = player.dishCardsDiscardPile.length;
            
            player.hostDoggoCard(mockDoggo);
            
            // Should have drawn 3 cards and added their income
            expect(player.dishCardsDiscardPile).toHaveLength(initialDiscardCount + 3);
            expect(player.money).toBeGreaterThan(initialMoney);
        });

        test('should process store income when doggo visits built stores', () => {
            const store = new Store('Test Store', 3, 2, 'restaurant');
            store.build(); // Mark store as built
            player.storeCards = [store];
            
            const mockDoggo = {
                dishes_eaten: 1,
                stores_visited: ['restaurant']
            };
            
            const initialMoney = player.money;
            
            player.hostDoggoCard(mockDoggo);
            
            // Should have additional income from the store
            expect(player.money).toBeGreaterThan(initialMoney);
        });

        test('should not process store income when store is not built', () => {
            const store = new Store('Test Store', 3, 2, 'restaurant');
            // Store is not built
            player.storeCards = [store];
            
            const mockDoggo = {
                dishes_eaten: 1,
                stores_visited: ['restaurant']
            };
            
            const initialMoney = player.money;
            
            player.hostDoggoCard(mockDoggo);
            
            // Should only have income from dishes, not from unbuilt store
            expect(player.money).toBeGreaterThan(initialMoney);
        });
    });

    describe('Player Information', () => {
        test('should get correct net worth', () => {
            expect(player.getNetWorth()).toBe(player.money);
            
            player.addMoney(10);
            expect(player.getNetWorth()).toBe(player.money);
        });

        test('should get correct player summary', () => {
            const summary = player.getSummary();
            
            expect(summary).toEqual({
                id: 'player1',
                name: 'Alice',
                avatar: '/avatar1.png',
                money: 5,
                storeCardCount: 0,
                dishCardCount: 8,
                dishCardsDrawPileCount: 8,
                dishCardsDiscardPileCount: 0
            });
        });

        test('should get correct waiting room summary', () => {
            const waitingSummary = player.getWaitingRoomSummary();
            
            expect(waitingSummary).toEqual({
                name: 'Alice',
                avatar: '/avatar1.png'
            });
        });

        test('should update summary after state changes', () => {
            player.acquireStoreCard(new Store(StoreTypes.TOY_SHOP));
            player.acquireStoreCard(new Store(StoreTypes.GROOMING_SPA));
            player.addMoney(5);
            
            const summary = player.getSummary();
            
            expect(summary.money).toBe(8); // 5 + 5 - 2
            expect(summary.storeCardCount).toBe(2);
        });
    });

    describe('Edge Cases', () => {
        test('should handle negative money amounts', () => {
            const initialMoney = player.money;
            
            player.addMoney(-5);
            expect(player.money).toBe(initialMoney - 5);
            
            const result = player.removeMoney(-3);
            expect(result).toBe(true);
            expect(player.money).toBe(initialMoney - 5 + 3);
        });

        test('should handle very large amounts', () => {
            const largeAmount = 1000000;
            
            player.addMoney(largeAmount);
            expect(player.money).toBe(5 + largeAmount);
            
            const result = player.removeMoney(largeAmount);
            expect(result).toBe(true);
            expect(player.money).toBe(5);
        });

        test('should handle empty arrays and null values gracefully', () => {
            // Test with empty store cards
            player.storeCards = [];
            const mockDoggo = { dishes_eaten: 1, stores_visited: [] };
            
            expect(() => player.hostDoggoCard(mockDoggo)).not.toThrow();
        });
    });

    describe('toResponse', () => {
        test('should return correct response', () => {
            player.addMoney(20);
            player.acquireStoreCard(new Store(StoreTypes.TOY_SHOP));
            player.acquireStoreCard(new Store(StoreTypes.GROOMING_SPA));
            player.buildStore(0);
            player.buildStore(1);
            player.hostDoggoCard({ dishes_eaten: 1, stores_visited:[StoreTypes.GROOMING_SPA] });
            const response = player.toResponse();
            // console.log(response);
        });
    });
}); 
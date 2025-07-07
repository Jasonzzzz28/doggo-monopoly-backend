const { DoggoCards, getDoggoCard, getRandomDoggoCard, getRandomDoggoCards } = require('../../../src/game/doggoCards');

describe('DoggoCards', () => {
    test('should have all predefined doggo cards', () => {
        expect(DoggoCards.GOLDEN_RETRIEVER).toBeDefined();
        expect(DoggoCards.POODLE).toBeDefined();
        expect(DoggoCards.DACHSHUND).toBeDefined();
        expect(DoggoCards.BULLDOG).toBeDefined();
        expect(DoggoCards.HUSKY).toBeDefined();
        expect(DoggoCards.POMERANIAN).toBeDefined();
    });
});

describe('getDoggoCard', () => {
    test('should return the correct doggo card by ID', () => {
        const card = getDoggoCard('doggo_001');
        expect(card).toEqual(DoggoCards.GOLDEN_RETRIEVER);
    });

    test('should return null for an invalid ID', () => {
        const card = getDoggoCard('invalid_id');
        expect(card).toBeNull();
    });
});

describe('getRandomDoggoCards', () => {
    test('should return the specified number of random doggo cards', () => {
        const cards = getRandomDoggoCards(3);
        expect(cards).toHaveLength(3);
        cards.forEach(card => {
            expect(Object.values(DoggoCards)).toContain(card);
        });
    });

    test('should return an empty array if count is 0', () => {
        const cards = getRandomDoggoCards(0);
        expect(cards).toHaveLength(0);
    });

    test('should return all cards if count exceeds available cards', () => {
        const cards = getRandomDoggoCards(20);
        expect(cards).toHaveLength(Object.values(DoggoCards).length);
    });
});

describe('DoggoCards Immutability', () => {
    test('should not allow modification of doggo card properties', () => {
        const goldenRetriever = DoggoCards.GOLDEN_RETRIEVER;
        
        goldenRetriever.name = 'Modified Name';
        expect(goldenRetriever.name).toBe('Golden Retriever');

        expect(() => {
            goldenRetriever.stores_visited.push('new-store');
        }).toThrow();
    });

    test('should not allow adding new properties to doggo cards', () => {
        const goldenRetriever = DoggoCards.GOLDEN_RETRIEVER;

        goldenRetriever.newProperty = 'new value';
        expect(goldenRetriever.newProperty).toBeUndefined();
    });

    test('should not allow deletion of doggo card properties', () => {
        const goldenRetriever = DoggoCards.GOLDEN_RETRIEVER;

        delete goldenRetriever.name;
        expect(goldenRetriever.name).toBe('Golden Retriever');
    });
});


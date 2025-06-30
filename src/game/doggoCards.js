const StoreTypes = require('./storeTypes');
const DoggoCards = Object.freeze({
    GOLDEN_RETRIEVER: Object.freeze({
        id: 'doggo_001',
        name: 'Golden Retriever',
        description: 'A friendly and energetic dog who loves to play and eat hearty meals',
        image: 'golden-retriever.jpg',
        dishes_eaten: 2,
        stores_visited: Object.freeze([StoreTypes.TOY_SHOP, StoreTypes.BONE_BAKERY, StoreTypes.DOG_PARK])
    }),
    POODLE: Object.freeze({
        id: 'doggo_002',
        name: 'Poodle',
        description: 'An elegant and sophisticated dog who enjoys fancy treats and grooming',
        image: 'poodle.jpg',
        dishes_eaten: 1,
        stores_visited: Object.freeze([StoreTypes.GROOMING_SPA, StoreTypes.TREAT_CAFE])
    }),
    DACHSHUND: Object.freeze({
        id: 'doggo_003',
        name: 'Dachshund',
        description: 'A small but mighty dog who loves small snacks and cozy spaces',
        image: 'dachshund.jpg',
        dishes_eaten: 1,
        stores_visited: Object.freeze([StoreTypes.BONE_BAKERY, StoreTypes.TOY_SHOP])
    }),
    BULLDOG: Object.freeze({
        id: 'doggo_004',
        name: 'Bulldog',
        description: 'A strong and loyal dog who enjoys hearty meals and relaxation',
        image: 'bulldog.jpg',
        dishes_eaten: 2,
        stores_visited: Object.freeze([StoreTypes.BONE_BAKERY, StoreTypes.DOG_PARK, StoreTypes.TREAT_CAFE])
    }),
    HUSKY: Object.freeze({
        id: 'doggo_005',
        name: 'Husky',
        description: 'An adventurous and active dog who loves outdoor activities and protein-rich food',
        image: 'husky.jpg',
        dishes_eaten: 2,
        stores_visited: Object.freeze([StoreTypes.DOG_PARK, StoreTypes.BONE_BAKERY, StoreTypes.TOY_SHOP])
    }),
    POMERANIAN: Object.freeze({
        id: 'doggo_006',
        name: 'Pomeranian',
        description: 'A tiny and fluffy dog who adores fancy treats and pampering',
        image: 'pomeranian.jpg',
        dishes_eaten: 1,
        stores_visited: Object.freeze([StoreTypes.GROOMING_SPA, StoreTypes.TREAT_CAFE, StoreTypes.TOY_SHOP])
    })
});

/**
 * Get a specific doggo card by ID
 * @param {string} cardId - The card ID to look up
 * @returns {Object|null} The card object or null if not found
 */
function getDoggoCard(cardId) {
    return Object.values(DoggoCards).find(card => card.id === cardId) || null;
}

/**
 * Get multiple random doggo cards
 * @param {number} count - Number of cards to get
 * @returns {Array} Array of random card objects
 */
function getRandomDoggoCards(count) {
    const cards = Object.values(DoggoCards);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

module.exports = {
    DoggoCards,
    getDoggoCard,
    getRandomDoggoCards
}; 
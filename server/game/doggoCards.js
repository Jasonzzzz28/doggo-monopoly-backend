const DoggoCard = {
    GOLDEN_RETRIEVER: {
        id: 'doggo_001',
        name: 'Golden Retriever',
        description: 'A friendly and energetic dog who loves to play and eat hearty meals',
        image: 'golden-retriever.jpg',
        dishes_eaten: 2,
        stores_visited: ['toy-shop', 'bone-bakery', 'dog-park']
    },
    POODLE: {
        id: 'doggo_002',
        name: 'Poodle',
        description: 'An elegant and sophisticated dog who enjoys fancy treats and grooming',
        image: 'poodle.jpg',
        dishes_eaten: 1,
        stores_visited: ['grooming-spa', 'treat-cafe']
    },
    DACHSHUND: {
        id: 'doggo_003',
        name: 'Dachshund',
        description: 'A small but mighty dog who loves small snacks and cozy spaces',
        image: 'dachshund.jpg',
        dishes_eaten: 1,
        stores_visited: ['bone-bakery', 'toy-shop']
    },
    BULLDOG: {
        id: 'doggo_004',
        name: 'Bulldog',
        description: 'A strong and loyal dog who enjoys hearty meals and relaxation',
        image: 'bulldog.jpg',
        dishes_eaten: 2,
        stores_visited: ['bone-bakery', 'dog-park', 'treat-cafe']
    },
    HUSKY: {
        id: 'doggo_005',
        name: 'Husky',
        description: 'An adventurous and active dog who loves outdoor activities and protein-rich food',
        image: 'husky.jpg',
        dishes_eaten: 2,
        stores_visited: ['dog-park', 'bone-bakery', 'toy-shop']
    },
    POMERANIAN: {
        id: 'doggo_006',
        name: 'Pomeranian',
        description: 'A tiny and fluffy dog who adores fancy treats and pampering',
        image: 'pomeranian.jpg',
        dishes_eaten: 1,
        stores_visited: ['grooming-spa', 'treat-cafe', 'toy-shop']
    }
};

/**
 * Get all doggo cards as an array
 * @returns {Array} Array of all doggo card objects
 */
function getAllDoggoCards() {
    return Object.values(DoggoCard);
}

/**
 * Get a specific doggo card by ID
 * @param {string} cardId - The card ID to look up
 * @returns {Object|null} The card object or null if not found
 */
function getDoggoCard(cardId) {
    return Object.values(DoggoCard).find(card => card.id === cardId) || null;
}

/**
 * Get a random doggo card
 * @returns {Object} A random card object
 */
function getRandomDoggoCard() {
    const cards = getAllDoggoCards();
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex];
}

/**
 * Get multiple random doggo cards
 * @param {number} count - Number of cards to get
 * @returns {Array} Array of random card objects
 */
function getRandomDoggoCards(count) {
    const cards = getAllDoggoCards();
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Check if a card ID is valid
 * @param {string} cardId - The card ID to validate
 * @returns {boolean} True if the card ID exists
 */
function isValidDoggoCard(cardId) {
    return Object.values(DoggoCard).some(card => card.id === cardId);
}

module.exports = {
    DoggoCard,
    getAllDoggoCards,
    getDoggoCard,
    getRandomDoggoCard,
    getRandomDoggoCards,
    isValidDoggoCard
}; 
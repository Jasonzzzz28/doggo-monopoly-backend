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
        dishes_eaten: 3,
        stores_visited: Object.freeze([StoreTypes.GROOMING_SPA, StoreTypes.TREAT_CAFE])
    }),
    DACHSHUND: Object.freeze({
        id: 'doggo_003',
        name: 'Dachshund',
        description: 'A small but mighty dog who loves small snacks and cozy spaces',
        image: 'dachshund.jpg',
        dishes_eaten: 3,
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
        stores_visited: Object.freeze([StoreTypes.GROOMING_SPA, StoreTypes.TREAT_CAFE, StoreTypes.TOY_SHOP, StoreTypes.PET_FINE_DINING])
    }),
    SHIBA_INU: Object.freeze({
        id: 'doggo_007',
        name: 'Shiba Inu',
        description: 'A spirited and alert dog who loves adventure and tasty snacks',
        image: 'shiba-inu.jpg',
        dishes_eaten: 2,
        stores_visited: Object.freeze([StoreTypes.DOG_PARK, StoreTypes.TOY_SHOP, StoreTypes.PET_CLINIC])
    }),
    BEAGLE: Object.freeze({
        id: 'doggo_008',
        name: 'Beagle',
        description: 'A curious and merry dog who enjoys treats and exploring new places',
        image: 'beagle.jpg',
        dishes_eaten: 3,
        stores_visited: Object.freeze([StoreTypes.BONE_BAKERY, StoreTypes.ICE_CREAM_PARLOR])
    }),
    CORGI: Object.freeze({
        id: 'doggo_009',
        name: 'Corgi',
        description: 'A playful and affectionate dog who loves running and gourmet snacks',
        image: 'corgi.jpg',
        dishes_eaten: 1,
        stores_visited: Object.freeze([StoreTypes.TREAT_CAFE, StoreTypes.PET_HOTEL, StoreTypes.DOG_BAR, StoreTypes.GROOMING_SPA])
    }),
    BOXER: Object.freeze({
        id: 'doggo_010',
        name: 'Boxer',
        description: 'An energetic and loyal dog who enjoys hearty meals and fun activities',
        image: 'boxer.jpg',
        dishes_eaten: 2,
        stores_visited: Object.freeze([StoreTypes.SWIMMING_POOL, StoreTypes.DOG_ATM, StoreTypes.TOY_SHOP])
    }),
    DALMATIAN: Object.freeze({
        id: 'doggo_011',
        name: 'Dalmatian',
        description: 'A lively and intelligent dog who loves treats and socializing',
        image: 'dalmatian.jpg',
        dishes_eaten: 3,
        stores_visited: Object.freeze([StoreTypes.PET_FINE_DINING, StoreTypes.DOG_BAR])
    }),
    FRENCH_BULLDOG: Object.freeze({
        id: 'doggo_012',
        name: 'French Bulldog',
        description: 'A charming and adaptable dog who enjoys pampering and snacks',
        image: 'french-bulldog.jpg',
        dishes_eaten: 2,
        stores_visited: Object.freeze([StoreTypes.GROOMING_SPA, StoreTypes.PET_CLINIC, StoreTypes.ICE_CREAM_PARLOR])
    }),
    BORDER_COLLIE: Object.freeze({
        id: 'doggo_013',
        name: 'Border Collie',
        description: 'A smart and energetic dog who loves games and healthy treats',
        image: 'border-collie.jpg',
        dishes_eaten: 1,
        stores_visited: Object.freeze([StoreTypes.DOG_PARK, StoreTypes.SWIMMING_POOL, StoreTypes.BONE_BAKERY, StoreTypes.PET_HOTEL])
    }),
    CHIHUAHUA: Object.freeze({
        id: 'doggo_014',
        name: 'Chihuahua',
        description: 'A tiny but bold dog who enjoys fancy treats and cozy places',
        image: 'chihuahua.jpg',
        dishes_eaten: 4,
        stores_visited: Object.freeze([StoreTypes.TREAT_CAFE])
    }),
    GREAT_DANE: Object.freeze({
        id: 'doggo_015',
        name: 'Great Dane',
        description: 'A gentle giant who loves hearty meals and relaxing at fun spots',
        image: 'great-dane.jpg',
        dishes_eaten: 2,
        stores_visited: Object.freeze([StoreTypes.DOG_ATM, StoreTypes.PET_FINE_DINING, StoreTypes.DOG_PARK])
    }),
    SHELTIE: Object.freeze({
        id: 'doggo_016',
        name: 'Sheltie',
        description: 'A bright and agile dog who enjoys games and delicious snacks',
        image: 'sheltie.jpg',
        dishes_eaten: 3,
        stores_visited: Object.freeze([StoreTypes.TOY_SHOP, StoreTypes.SWIMMING_POOL])
    }),
    ROTTWEILER: Object.freeze({
        id: 'doggo_017',
        name: 'Rottweiler',
        description: 'A confident and calm dog who enjoys hearty food and relaxing',
        image: 'rottweiler.jpg',
        dishes_eaten: 2,
        stores_visited: Object.freeze([StoreTypes.BONE_BAKERY, StoreTypes.PET_HOTEL, StoreTypes.PET_CLINIC])
    }),
    AUSTRALIAN_SHEPHERD: Object.freeze({
        id: 'doggo_018',
        name: 'Australian Shepherd',
        description: 'An active and intelligent dog who loves outdoor fun and treats',
        image: 'australian-shepherd.jpg',
        dishes_eaten: 1,
        stores_visited: Object.freeze([StoreTypes.DOG_PARK, StoreTypes.GROOMING_SPA, StoreTypes.ICE_CREAM_PARLOR, StoreTypes.DOG_BAR])
    }),
    SAMOYED: Object.freeze({
        id: 'doggo_019',
        name: 'Samoyed',
        description: 'A fluffy and friendly dog who enjoys pampering and gourmet snacks',
        image: 'samoyed.jpg',
        dishes_eaten: 2,
        stores_visited: Object.freeze([StoreTypes.PET_FINE_DINING, StoreTypes.GROOMING_SPA, StoreTypes.TREAT_CAFE])
    }),
    AKITA: Object.freeze({
        id: 'doggo_020',
        name: 'Akita',
        description: 'A dignified and courageous dog who enjoys hearty meals and fun activities',
        image: 'akita.jpg',
        dishes_eaten: 3,
        stores_visited: Object.freeze([StoreTypes.SWIMMING_POOL, StoreTypes.DOG_ATM])
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
const SpecialEffect = require('./specialEffect');

const StoreTypes = Object.freeze({
    TOY_SHOP: Object.freeze({
        type: "toy-shop",
        name: "Toy Shop",
        description: "A fun store filled with squeaky toys and interactive games",
        build_cost: 6,
        income_per_doggo: 0,
        special_effect: SpecialEffect.DICE_ROLL,
        color: "blue",
        icon: "fas fa-store",
        image: "toy-shop.jpg"
    }),
    GROOMING_SPA: Object.freeze({
        type: "grooming-spa",
        name: "Grooming Spa",
        description: "A luxurious spa for pampering and grooming services",
        build_cost: 6,
        income_per_doggo: 0,
        special_effect: SpecialEffect.DRAW_EXTRA_TWO_DOGGO_CARDS,
        color: "purple",
        icon: "fas fa-spa",
        image: "grooming-spa.jpg"
    }),
    BONE_BAKERY: Object.freeze({
        type: "bone-bakery",
        name: "Bone Bakery",
        description: "A bakery specializing in fresh-baked dog treats and bones",
        build_cost: 6,
        income_per_doggo: 3,
        special_effect: SpecialEffect.NO_EFFECT,
        color: "amber",
        icon: "fas fa-bone",
        image: "bone-bakery.jpg"
    }),
    DOG_PARK: Object.freeze({
        type: "dog-park",
        name: "Dog Park",
        description: "An outdoor park with agility equipment and play areas",
        build_cost: 7,
        income_per_doggo: 1,
        special_effect: SpecialEffect.EARN_MONEY_AS_AMOUNT_DISHES_EATEN,
        color: "green",
        icon: "fas fa-paw",
        image: "dog-park.jpg"
    }),
    TREAT_CAFE: Object.freeze({
        type: "treat-cafe",
        name: "Treat Cafe",
        description: "A cozy cafe serving gourmet dog treats and refreshments",
        build_cost: 7,
        income_per_doggo: 4,
        special_effect: SpecialEffect.NO_EFFECT,
        color: "pink",
        icon: "fas fa-coffee",
        image: "treat-cafe.jpg"
    }),
    PET_CLINIC: Object.freeze({
        type: "pet-clinic",
        name: "Pet Clinic",
        description: "A medical clinic providing health care and check-ups",
        build_cost: 8,
        income_per_doggo: 0,
        special_effect: SpecialEffect.EARN_MONEY_AS_AMOUNT_BUILT_STORES,
        color: "red",
        icon: "fas fa-stethoscope",
        image: "vet-clinic.jpg"
    }),
    PET_FINE_DINING: Object.freeze({
        type: "pet-fine-dining",
        name: "Pet Fine Dining",
        description: "A fine dining restaurant for dogs",
        build_cost: 9,
        income_per_doggo: 6,
        special_effect: SpecialEffect.NO_EFFECT,
        color: "#81d8d0",
        icon: "fas fa-champagne-glasses",
        image: "pet-fine-dining.jpg"
    }),
    SWIMMING_POOL: Object.freeze({
        type: "swimming-pool",
        name: "Swimming Pool",
        description: "An indoor pool for swimming lessons and water fun",
        build_cost: 5,
        income_per_doggo: 2,
        special_effect: SpecialEffect.ICE_CREAM_PARLOR_PLUS_TWO_COINS,
        color: "#338dff",
        icon: "fas fa-swimming-pool",
        image: "swimming-pool.jpg"
    }),
    PET_HOTEL: Object.freeze({
        type: "pet-hotel",
        name: "Pet Hotel",
        description: "A luxury hotel for overnight stays and boarding",
        build_cost: 5,
        income_per_doggo: 2,
        special_effect: SpecialEffect.DOG_BAR_DOG_PARK_SWIMMING_POOL_PLUS_ONE_COIN,
        color: "#ffcd25",
        icon: "fas fa-hotel",
        image: "pet-hotel.jpg"
    }),
    ICE_CREAM_PARLOR: Object.freeze({
        type: "ice-cream-parlor",
        name: "Ice Cream Parlor",
        description: "A sweet shop serving dog-friendly ice cream and frozen treats",
        build_cost: 5,
        income_per_doggo: 2,
        special_effect: SpecialEffect.TOY_SHOP_PLUS_TWO_COINS,
        color: "#f1d1f1",
        icon: "fas fa-ice-cream",
        image: "ice-cream-parlor.jpg"
    }),
    DOG_ATM: Object.freeze({
        type: "dog-atm",
        name: "Dog ATM",
        description: "A machine that dispenses dog money",
        build_cost: 5,
        income_per_doggo: 2,
        special_effect: SpecialEffect.PET_HOTEL_TREAT_CAFE_PET_FINE_DINING_PLUS_ONE_COIN,
        color: "#85bb65",
        icon: "fas fa-money-bill",
        image: "dog-atm.jpg"
    }),
    DOG_BAR: Object.freeze({
        type: "dog-bar",
        name: "Dog Bar",
        description: "A bar for dogs to socialize and relax",
        build_cost: 5,
        income_per_doggo: 2,
        special_effect: SpecialEffect.BONE_BAKERY_PLUS_TWO_COINS,
        color: "#f5a623",
        icon: "fas fa-beer",
        image: "dog-bar.jpg"
    }),

});

module.exports = {StoreTypes};
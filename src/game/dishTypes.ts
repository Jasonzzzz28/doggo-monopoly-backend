import { DishType, SpecialEffect } from '../types';

export const DishTypes: Record<string, DishType> = Object.freeze({
    LEVEL_1: Object.freeze({
        type: "level-1",
        name: "Basic Dish",
        description: "A simple dish that's easy to prepare and serve",
        build_cost: 0,
        income: 1,
        special_effect: SpecialEffect.NO_EFFECT,
        color: "gray",
        icon: "fas fa-bowl-food",
        image: "basic-dish.jpg"
    }),
    LEVEL_2: Object.freeze({
        type: "level-2",
        name: "Standard Dish",
        description: "A well-prepared dish with good quality ingredients",
        build_cost: 3,
        income: 2,
        special_effect: SpecialEffect.NO_EFFECT,
        color: "blue",
        icon: "fas fa-plate-wheat",
        image: "standard-dish.jpg"
    }),
    LEVEL_3: Object.freeze({
        type: "level-3",
        name: "Premium Dish",
        description: "A high-quality dish made with premium ingredients",
        build_cost: 6,
        income: 3,
        special_effect: SpecialEffect.NO_EFFECT,
        color: "purple",
        icon: "fas fa-wine-glass",
        image: "premium-dish.jpg"
    }),
    LEVEL_4: Object.freeze({
        type: "level-4",
        name: "Specialty Dish",
        description: "A unique dish with bonus income based on dice roll",
        build_cost: 9,
        income: 2,
        special_effect: SpecialEffect.DICE_ROLL,
        color: "gold",
        icon: "fas fa-crown",
        image: "specialty-dish.jpg"
    })
});

export const dishTypeMapper: Record<string, DishType> = Object.freeze({
    "level-1": DishTypes.LEVEL_1,
    "level-2": DishTypes.LEVEL_2,
    "level-3": DishTypes.LEVEL_3,
    "level-4": DishTypes.LEVEL_4
}); 
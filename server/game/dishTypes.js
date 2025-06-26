const dishTypes = [
    {
        type: "level-1",
        name: "Basic Dish",
        description: "A simple dish that's easy to prepare and serve",
        build_cost: 0,
        income_per_doggo: 1,
        color: "gray",
        icon: "fas fa-utensils",
        image: "basic-dish.jpg"
    },
    {
        type: "level-2",
        name: "Standard Dish",
        description: "A well-prepared dish with good quality ingredients",
        build_cost: 3,
        income_per_doggo: 2,
        color: "blue",
        icon: "fas fa-plate-wheat",
        image: "standard-dish.jpg"
    },
    {
        type: "level-3",
        name: "Premium Dish",
        description: "A high-quality dish made with premium ingredients",
        build_cost: 6,
        income_per_doggo: 3,
        color: "purple",
        icon: "fas fa-crown",
        image: "premium-dish.jpg"
    },
    {
        type: "level-4",
        name: "Specialty Dish",
        description: "A unique dish with bonus income based on dice roll",
        build_cost: 9,
        income_per_doggo: 2,
        color: "gold",
        icon: "fas fa-star",
        image: "specialty-dish.jpg"
    }
];

// This line exports the `dishTypes` array so that it can be imported and used in other files within the Node.js application.
module.exports = dishTypes;

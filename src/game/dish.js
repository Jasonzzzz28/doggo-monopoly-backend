const DishTypes = require('./dishTypes');

class Dish {
    constructor(type, cardId) {
        this.type = type;
        this.cardId = cardId;
        this.isBuilt = isBuilt;
    }
    getType() {
        return this.type;
    }
    getCardId() {
        return this.cardId;
    }
    getCost() {
        return DishTypes[this.type].build_cost;
    }
    getIncome() {
        return DishTypes[this.type].income_per_doggo;
    }
    getSpecialEffect() {
        return DishTypes[this.type].special_effect;
    }
}

module.exports = Dish;
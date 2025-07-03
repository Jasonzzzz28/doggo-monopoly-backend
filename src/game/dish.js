const DishTypes = require('./dishTypes');

class Dish {
    constructor(type, cardId=null) {
        this.type = type;
        this.cardId = cardId;
    }
    getType() {
        return this.type;
    }
    getCardId() {
        return this.cardId;
    }
    getCost() {
        return this.type.build_cost;
    }
    getIncome() {
        return this.type.income_per_doggo;
    }
    getSpecialEffect() {
        return this.type.special_effect;
    }
}

module.exports = Dish;
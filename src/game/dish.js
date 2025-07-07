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
        return this.type.income;
    }
    getSpecialEffect() {
        return this.type.special_effect;
    }
    toResponse() {
        return {
            type: this.type.type,
            // TODO: add cardId when we have cardId
            cardId: null
        };
    }
}

module.exports = Dish;
const StoreTypes = require('./storeTypes');

// cardId could be used to identify the unique store card (json file) in the future
class Store {
    constructor(type, cardId=null, isCompleted=false) {
        this.type = type;
        this.cardId = cardId;
        this.isCompleted = isCompleted;
    }
    getType() {
        return this.type;
    }
    getCardId() {
        return this.cardId;
    }
    isBuilt() {
        return this.isCompleted;
    }
    build() {
        this.isCompleted = true;
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
    toResponse() {
        return {
            type: this.type.type,
            // TODO: add cardId when we have cardId
            cardId: null,
            isCompleted: this.isCompleted
        };
    }
}

module.exports = Store;
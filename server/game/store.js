const StoreTypes = require('./storeTypes');

// cardId could be used to identify the unique store card (json file) in the future
class Store {
    constructor(type, cardId, isBuilt = false) {
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
    isBuilt() {
        return this.isBuilt;
    }
    build() {
        this.isBuilt = true;
    }
    getCost() {
        return StoreTypes[this.type].build_cost;
    }
    getIncome() {
        return StoreTypes[this.type].income_per_doggo;
    }
    getSpecialEffect() {
        return StoreTypes[this.type].special_effect;
    }
}

module.exports = {Store};
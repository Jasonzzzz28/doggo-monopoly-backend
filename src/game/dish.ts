import { DishType } from '../types';

export class Dish {
    private type: DishType;
    private cardId: string | null;

    constructor(type: DishType, cardId: string | null = null) {
        this.type = type;
        this.cardId = cardId;
    }

    getType(): DishType {
        return this.type;
    }

    getCardId(): string | null {
        return this.cardId;
    }

    getCost(): number {
        return this.type.build_cost;
    }

    getIncome(): number {
        return this.type.income;
    }

    getSpecialEffect(): string {
        return this.type.special_effect;
    }

    toResponse(): { type: string; cardId: string | null } {
        return {
            type: this.type.type,
            // TODO: add cardId when we have cardId
            cardId: null
        };
    }
} 
import { StoreType } from '../types';

// cardId could be used to identify the unique store card (json file) in the future
export class Store {
    private type: StoreType;
    private cardId: string | null;
    private isCompleted: boolean;

    constructor(type: StoreType, cardId: string | null = null, isCompleted: boolean = false) {
        this.type = type;
        this.cardId = cardId;
        this.isCompleted = isCompleted;
    }

    getType(): StoreType {
        return this.type;
    }

    getCardId(): string | null {
        return this.cardId;
    }

    isBuilt(): boolean {
        return this.isCompleted;
    }

    build(): void {
        this.isCompleted = true;
    }

    getCost(): number {
        return this.type.build_cost;
    }

    getIncome(): number {
        return this.type.income_per_doggo;
    }

    getSpecialEffect(): string {
        return this.type.special_effect;
    }

    toResponse(): { type: string; cardId: string | null; isCompleted: boolean } {
        return {
            type: this.type.type,
            // TODO: add cardId when we have cardId
            cardId: null,
            isCompleted: this.isCompleted
        };
    }
} 
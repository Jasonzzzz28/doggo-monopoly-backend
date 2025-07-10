// Core game types
export interface GameState {
  id: string;
  status: GameStatus;
  requiredPlayers: number;
  playerOrder: string[];
  currentPlayerIndex: number;
  turnNumber: number;
  createdAt: number;
  players: Record<string, PlayerSummary>;
  npcDoggos: {
    visible: DoggoCard[];
    discardPileCount: number;
    drawPileCount: number;
  };
  storeMarket: {
    visible: StoreResponse[];
    drawPileCount: number;
  };
}

export interface PlayerSummary {
  id: string;
  name: string;
  avatar: string | null;
  money: number;
  storeCardCount: number;
  dishCardCount: number;
  dishCardsDrawPileCount: number;
  dishCardsDiscardPileCount: number;
}

export interface WaitingRoomSummary {
  name: string;
  avatar: string | null;
}

export interface PlayerResponse {
  name: string;
  avatar: string | null;
  numOfStoreBuilt: number;
  storeCards: StoreResponse[];
  dishCards: DishResponse[];
  money: number;
  dishCardsDrawPileLength: number;
  dishCardsDiscardPileLength: number;
  dishCardsDiscardPile: DishResponse[];
  extraStoreEarnings: Record<string, number>;
}

export interface StoreResponse {
  type: string;
  cardId: string | null;
  isCompleted: boolean;
}

export interface DishResponse {
  type: string;
  cardId: string | null;
}

export interface GameResponse {
  id: string;
  status: GameStatus;
  requiredPlayers: number;
  players: Record<string, PlayerResponse>;
  playerOrder: string[];
  currentPlayerIndex: number;
  npcDoggos: {
    visible: string[];
    discardPile: string[];
    extraMoney: number[];
  };
  storeMarket: {
    visible: StoreResponse[];
  };
  turnNumber: number;
  createdAt: number;
}

// Enums
export enum GameStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  ENDED = 'ended'
}

export enum SpecialEffect {
  NO_EFFECT = 'no_effect',
  DICE_ROLL = 'dice_roll',
  DRAW_EXTRA_TWO_DOGGO_CARDS = 'draw_extra_two_doggo_cards',
  EARN_MONEY_AS_AMOUNT_DISHES_EATEN = 'earn_money_as_amount_dishes_eaten',
  EARN_MONEY_AS_AMOUNT_BUILT_STORES = 'earn_money_as_amount_built_stores',
  ICE_CREAM_PARLOR_PLUS_TWO_COINS = 'ice_cream_parlor_plus_two_coins',
  DOG_BAR_DOG_PARK_SWIMMING_POOL_PLUS_ONE_COIN = 'dog_bar_dog_park_swimming_pool_plus_one_coin',
  TOY_SHOP_PLUS_TWO_COINS = 'toy_shop_plus_two_coins',
  PET_HOTEL_TREAT_CAFE_PET_FINE_DINING_PLUS_ONE_COIN = 'pet_hotel_treat_cafe_pet_fine_dining_plus_one_coin',
  BONE_BAKERY_PLUS_TWO_COINS = 'bone_bakery_plus_two_coins',
}

// Store and Dish Types
export interface StoreType {
  type: string;
  name: string;
  description: string;
  build_cost: number;
  income_per_doggo: number;
  special_effect: SpecialEffect;
  color: string;
  icon: string;
  image: string;
}

export interface DishType {
  type: string;
  name: string;
  description: string;
  build_cost: number;
  income: number;
  special_effect: SpecialEffect;
  color: string;
  icon: string;
  image: string;
}

export interface DoggoCard {
  id: string;
  name: string;
  description: string;
  image: string;
  dishes_eaten: number;
  stores_visited: readonly StoreType[];
}

// Socket event types
export interface SocketData {
  gameId: string;
  playerId: string;
  [key: string]: any;
}

export interface ConnectToGameData extends SocketData {}

export interface StartGameData extends SocketData {}

export interface PlayerBuyDishData extends SocketData {
  dishType: DishType;
}

export interface PlayerRemoveDishData extends SocketData {
  dishIndex: number;
}

export interface PlayerBuyStoreData extends SocketData {
  storeIndex: number;
}

export interface PlayerHostDoggoData extends SocketData {
  doggoIndex: number;
}

// API request/response types
export interface CreateGameRequest {
  numberOfPlayers: number;
}

export interface CreateGameResponse {
  gameId: string;
}

export interface JoinGameRequest {
  playerName?: string;
  avatar?: string | null;
}

export interface JoinGameResponse {
  playerId: string;
  playerSimpleId: number;
  playerName: string;
  numberOfPlayers: number;
}

// Database types
export interface GameDatabase {
  get(key: string): any | undefined;
  set(key: string, value: any): void;
  has(key: string): boolean;
  delete(key: string): boolean;
  clear(): void;
  size: number;
  entries(): IterableIterator<[string, any]>;
  keys(): IterableIterator<string>;
  values(): IterableIterator<any>;
} 
import { GameDatabase } from '../types';

/**
 * DataBase for managing active games
 * TODO: Implement datastore like redis for horizontal scaling
 */
const dataBase: GameDatabase = new Map();

export default dataBase; 
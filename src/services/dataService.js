/**
 * DataBase for managing active games
 * TODO: Implement datastore like redis for horizontal scaling
 */
const dataBase = new Map();

module.exports = dataBase;

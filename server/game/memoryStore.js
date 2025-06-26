/**
 * Memory Store for managing active games
 * TODO: Implement datastore like redis for horizontal scaling
 */
const memoryStore = new Map();

module.exports = memoryStore;

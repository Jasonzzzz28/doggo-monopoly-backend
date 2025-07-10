# Doggo Monopoly Backend

A real-time multiplayer game server for Doggo Monopoly built with Node.js, Express, and Socket.IO.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

The server runs on port 3001 by default (configurable via `PORT` environment variable).

## 📡 API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Health Check
```
GET /health
```
Returns server status and timestamp.

### Game Management

#### Create Game
```
POST /create-game
```

**Request Body:**
```json
{
  "numberOfPlayers": 4
}
```

**Response:**
```json
{
  "gameId": "uuid-string"
}
```

**Validation:**
- `numberOfPlayers` must be between 2 and 6

#### Get Game
```
GET /game/:gameId
```

**Response:**
```json
{
  "id": "game-id",
  "status": "waiting|active|ended",
  "requiredPlayers": 4,
  "players": { ... },
  "playerOrder": ["player-id-1", "player-id-2"],
  "currentPlayerIndex": 0,
  "turnNumber": 1,
  "createdAt": 1234567890
}
```

#### Join Game
```
POST /game/:gameId/join
```

**Request Body:**
```json
{
  "playerName": "Player Name",
  "avatar": "avatar-url" // optional
}
```

**Response:**
```json
{
  "playerId": "uuid-string",
  "playerSimpleId": 1,
  "playerName": "Player Name",
  "numberOfPlayers": 4
}
```

## 🎮 WebSocket Events

Connect to the Socket.IO server at `http://localhost:3001`.

### Client to Server Events

#### Connect to Game
```javascript
socket.emit('connect_to_game', {
  gameId: 'game-id',
  playerId: 'player-id'
});
```

#### Start Game
```javascript
socket.emit('start_game', {
  gameId: 'game-id',
  playerId: 'player-id'
});
```

#### Buy Dish
```javascript
socket.emit('player_buy_dish', {
  gameId: 'game-id',
  playerId: 'player-id',
  dishType: {
    type: 'dish-type',
    name: 'Dish Name',
    description: 'Dish description',
    build_cost: 5,
    income: 3,
    special_effect: 'no_effect',
    color: '#FF0000',
    icon: 'dish-icon',
    image: 'dish-image'
  }
});
```

#### Remove Dish
```javascript
socket.emit('player_remove_dish', {
  gameId: 'game-id',
  playerId: 'player-id',
  dishIndex: 0
});
```

#### Buy Store
```javascript
socket.emit('player_buy_store', {
  gameId: 'game-id',
  playerId: 'player-id',
  storeIndex: 0
});
```

#### Host Doggo
```javascript
socket.emit('player_host_doggo', {
  gameId: 'game-id',
  playerId: 'player-id',
  doggoIndex: 0
});
```

### Server to Client Events

#### Waiting Room Update
```javascript
socket.on('waiting_room_update', (summary) => {
  // summary contains player list and game status
});
```

#### Game Update
```javascript
socket.on('game_update', (data) => {
  // data.game contains complete game state
});
```

#### Error
```javascript
socket.on('error', (data) => {
  // data.message contains error message
});
```

## 🎯 Game Flow

1. **Create Game**: Host creates a game with specified number of players
2. **Join Game**: Players join using the game ID
3. **Start Game**: Host starts the game when all players have joined
4. **Gameplay**: Players take turns buying dishes, stores, and hosting doggos
5. **Game End**: Game ends when victory conditions are met

## 🏗️ Project Structure

```
src/
├── api/
│   └── routes.ts          # REST API endpoints
├── game/
│   ├── game.ts           # Main game logic
│   ├── player.ts         # Player management
│   ├── dish.ts           # Dish card system
│   ├── store.ts          # Store card system
│   └── doggoCards.ts     # Doggo card system
├── sockets/
│   └── handlers.ts       # WebSocket event handlers
├── services/
│   └── dataService.ts    # In-memory data storage
├── types/
│   └── index.ts          # TypeScript type definitions
└── app.ts               # Main server setup
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📝 Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

## 🔧 Development Scripts

- `npm run dev`: Start development server with hot reload
- `npm run dev:watch`: Start with file watching
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm test`: Run tests 
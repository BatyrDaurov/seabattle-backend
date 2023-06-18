import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import WebsocketGames from './controllers/WebsocketGames.js';

const app = express();
const wsRouter = express.Router();
const wsInstance = expressWs(app);

app.use(express.json());
app.use(cors());
wsInstance.app.ws('/ws/seabattle', WebsocketGames.battleship);

export default app;

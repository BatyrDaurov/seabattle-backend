import { RequestType } from '../@types/RequestType.js';
import { WSreq } from '../constants/actions.js';
import { WsClient } from '../@types/WSClient.js';
import SessionBroadcast from '../models/broadcasts/SessionBroadcast.js';
import GlobalBroadcast from '../models/broadcasts/GlobalBroadcast.js';
import InitGame from '../models/InitGame.js';

const ROOMS = {};
let availablePlayers: WsClient[] = [];

export default class {
  static async battleship(ws: any) {
    ws.on('message', async (message: string) => {
      const req: RequestType = JSON.parse(message.toString());

      if (req.payload) {
        if (req.event === WSreq.CONNECT_ROOM) {
          const roomId = req.payload.roomId; // Получаем комнату
          InitGame(ws, ROOMS, roomId);
        }
        SessionBroadcast(ws, ROOMS, req);
      } else {
        GlobalBroadcast(ws, ROOMS, req, availablePlayers);
      }
    });
  }
}

//@ts-nocheck
import { RequestType } from '../../@types/RequestType.js';
import { WsClient } from '../../@types/WSClient.js';
import { WSreq, WSres } from '../../constants/actions.js';

export default (ws: WsClient, ROOMS: object, req: RequestType, availablePlayers: WsClient[]) => {
  try {
    switch (req.event) {
      case WSreq.FIND_GAME:
        // Добавляем пользователя в массив игроков
        availablePlayers.push(ws);
        // Удаляем пользователя из поиска если он отключился
        ws.addEventListener('close', () => {
          const userIndex = availablePlayers.indexOf(ws);
          availablePlayers.splice(userIndex, 1);
        });

        // Если в поиске игры больше 2 человек, то сводим их
        while (availablePlayers.length >= 2 && availablePlayers.length % 2 === 0) {
          const roomId = Date.now();
          // Возращаем инфо. о комнате
          for (let i = 0; i < 2; i++) {
            const res = {
              type: WSres.GAME_FOUNDED,
              payload: {
                roomId,
              },
            };
            availablePlayers[i].send(JSON.stringify(res));
          }
          // Удаляем пользователей из поиска
          availablePlayers.shift();
          availablePlayers.shift();
        }

        break;

      // Количество игр
      case WSreq.GET_SESSIONS:
        const newRooms = [];
        for (let i = 0; i < Object.keys(ROOMS).length; i++) {
          console.log(ROOMS);

          const roomId = Object.entries(ROOMS).map((session) => session[0])[i];
          newRooms.push({
            roomId,
            players: Object.entries(ROOMS).map((session) =>
              session[1].map((user: WsClient) => user.userData),
            )[i],
          });
        }
        ws.send(
          JSON.stringify({
            type: WSres.SEND_SESSIONS,
            payload: {
              sessionsCount: Object.keys(ROOMS).length,
              sessionsData: newRooms,
            },
          }),
        );
        break;

      default:
        break;
    }
  } catch (error) {
    console.warn(error);
  }
};

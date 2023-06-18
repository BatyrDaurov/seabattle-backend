import { RequestType } from '../../@types/RequestType.js';
import { ResponseType } from '../../@types/ResponseType.js';
import { ShipType } from '../../@types/ShipType.js';
import { ShotState } from '../../@types/ShotState.js';
import { ShotType } from '../../@types/ShotType.js';
import { WsClient } from '../../@types/WSClient.js';
import { WSreq, WSres } from '../../constants/actions.js';
import { removeDiagonal } from '../../utils/removeCells.js';

export default (ws: WsClient, rooms: any, req: RequestType) => {
  try {
    let res: ResponseType;
    let roomId: number = req.payload.roomId;

    rooms[roomId].forEach((client: WsClient) => {
      switch (req.event) {
        case WSreq.CONNECT_ROOM:
          res = {
            type: WSres.CONNECT_ROOM,
            payload: {
              roomId,
              name: client.userData.name,
              rivalName: rooms[roomId].find(
                (user: WsClient) => user.userData.name !== client.userData.name,
              )?.userData.name,
            },
          };
          break;

        case WSreq.READY_TO_PLAY:
          if (rooms[roomId].length === 2) {
            // Setting Up User State
            ws.userData.ready = true;
            ws.userData.matrix = req.payload.ships;

            const readyPlayersCount = rooms[roomId].filter(
              (user: WsClient) => user.userData.ready === true,
            ).length;

            res = {
              type: readyPlayersCount === 2 ? WSres.START_GAME : WSres.READY_TO_PLAY,
              payload: {
                userCanStart: rooms[roomId].find(
                  (user: WsClient) =>
                    user.userData.name?.replace(' ', '') === req.payload.name?.replace(' ', ''),
                )?.userData.name,
                turn:
                  readyPlayersCount === 2
                    ? rooms[roomId].find((user: WsClient) => user.userData.turn === true)?.userData
                        .name
                    : undefined,
              },
            };
          }
          break;

        case WSreq.SHOOT:
          // Вся информация о выстреле, и о корабле
          const shots: ShotType[] = [];
          const shotState: ShotState = {
            x: req.payload.coordinates.x,
            y: req.payload.coordinates.y,
            shooted: client.userData.name?.replace(' ', '') !== req.payload.name?.replace(' ', ''),
            enemy: rooms[roomId].find(
              (user: WsClient) =>
                user.userData.name?.replace(' ', '') !== req.payload.name?.replace(' ', ''),
            ),
            responseShip: {
              isKilled: false,
              isHitted: false,
            },
          };

          // Если это тот по кому выстрелили, проверяем его матрицу, если наоборот, матрицу противника
          shotState.shooted
            ? client.userData.matrix?.forEach((ship: ShipType) => {
                if (ship.direction === 'row') {
                  // Диапозон попадания если корабль в ряд
                  const x1 = ship.x + ship.length - 1; // Конечная точка по x
                  if (shotState.x >= ship.x && x1 >= shotState.x && ship.y === shotState.y) {
                    const shotShip = ship.range.find(
                      (shipValues) => shipValues.x === shotState.x && shipValues.y === shotState.y,
                    );
                    if (shotShip) {
                      shotShip.isHitted = true;
                    }
                    shotState.responseShip.isHitted = true; // Отмечаем попадание
                  }
                } else {
                  // Диапозон попадания если корабль в колону
                  const y1 = ship.y + ship.length - 1; // Конечная точка по y
                  if (shotState.y >= ship.y && y1 >= shotState.y && ship.x === shotState.x) {
                    const shotShip = ship.range.find(
                      (shipValues) => shipValues.x === shotState.x && shipValues.y === shotState.y,
                    );
                    if (shotShip) {
                      shotShip.isHitted = true;
                    }
                    shotState.responseShip.isHitted = true; // Отмечаем попадание
                  }
                }
                // Если корабль затопили
                if (ship.range.every((shot) => shot.isHitted === true)) {
                  shotState.responseShip.isKilled = true;
                }
              })
            : shotState.enemy.userData.matrix?.forEach((ship: ShipType) => {
                if (ship.direction === 'row') {
                  // Диапозон попадания если корабль в ряд
                  const x1 = ship.x + ship.length - 1; // Конечная точка по x
                  if (shotState.x >= ship.x && x1 >= shotState.x && ship.y === shotState.y) {
                    const shotShip = ship.range.find(
                      (shipValues) => shipValues.x === shotState.x && shipValues.y === shotState.y,
                    );
                    if (shotShip) {
                      shotShip.isHitted = true;
                    }
                    shotState.responseShip.isHitted = true; // Отмечаем попадание
                  }
                } else {
                  // Диапозон попадания если корабль в колону
                  const y1 = ship.y + ship.length - 1; // Конечная точка по y
                  if (shotState.y >= ship.y && y1 >= shotState.y && ship.x === shotState.x) {
                    const shotShip = ship.range.find(
                      (shipValues) => shipValues.x === shotState.x && shipValues.y === shotState.y,
                    );
                    if (shotShip) {
                      shotShip.isHitted = true;
                    }
                    shotState.responseShip.isHitted = true; // Отмечаем попадание
                  }
                }
                // Если корабль затопили
                if (ship.range.every((shot) => shot.isHitted === true)) {
                  shotState.responseShip.isKilled = true;
                }
              });

          // Загружаем выстрелы в массив
          if (shotState.responseShip.isHitted) {
            // Если попали по кораблю, ищем поле нужного игрока
            const ships = shotState.shooted
              ? client.userData.matrix
              : rooms[roomId].find(
                  (user: WsClient) =>
                    user.userData.name?.replace(' ', '') !== req.payload.name?.replace(' ', ''),
                ).userData.matrix;
            // Удаляем ячейки рядом с кораблем, по диагонали и т.д
            shots.push(...removeDiagonal(shotState.x, shotState.y, ships));
          }
          // Добавляем сам выстрел
          shots.push({
            x: shotState.x,
            y: shotState.y,
            isHitted: shotState.responseShip.isHitted,
          });

          // Проверяем выигрыш
          const myShips = client.userData.matrix?.every((ship: ShipType) =>
            ship.range.every((shot) => shot.isHitted),
          );
          const enemy = rooms[roomId].find(
            (user: WsClient) =>
              user.userData.name?.replace(' ', '') !== client.userData.name?.replace(' ', ''),
          );

          if (
            myShips ||
            enemy.userData.matrix?.every((ship: ShipType) =>
              ship.range.every((shot) => shot.isHitted),
            )
          ) {
            client.userData.ready = false;
            client.userData.wonPrevGame =
              client.userData.name?.replace(' ', '') === req.payload.name?.replace(' ', '');

            res = {
              type: WSres.GAME_OVER,
              payload: {
                won: myShips ? enemy.userData.name : client.userData.name,
                name: req.payload.name,
                turn: '',
                shots: shots,
                ships: client.userData.matrix,
              },
            };
          } else {
            res = {
              type: WSres.SHOOT,
              payload: {
                name: req.payload.name,
                turn: shotState.responseShip.isHitted
                  ? req.payload.name
                  : shotState.enemy.userData.name,
                shots: shots,
                ships: client.userData.matrix,
                floodedShips: enemy.userData.matrix?.filter((ship: ShipType) =>
                  ship.range.every((shot: ShotType) => shot.isHitted),
                ),
              },
            };
          }
          break;

        case WSreq.REVENGE:
          if (rooms[roomId].length === 2) {
            // Setting Up User State
            ws.userData = {
              ...ws.userData,
              turn: !ws.userData.wonPrevGame,
              ready: true,
              matrix: req.payload.ships,
              shots: [],
            };

            const revengePlayersCount = rooms[roomId].filter(
              (user: WsClient) => user.userData.ready,
            ).length;

            res = {
              type: revengePlayersCount === 2 ? WSres.START_GAME : WSres.READY_TO_PLAY,
              payload: {
                userCanStart: rooms[roomId].find(
                  (user: WsClient) =>
                    user.userData.name?.replace(' ', '') === req.payload.name?.replace(' ', ''),
                )?.userData.name,
                turn:
                  revengePlayersCount === 2
                    ? rooms[roomId].find((user: WsClient) => user.userData.turn)?.userData.name
                    : undefined,
              },
            };
          }
          break;

        case WSreq.LOGOUT:
          res = {
            type: WSres.STOP_GAME,
            payload: {},
          };
          break;

        default:
          break;
      }
      client.send(JSON.stringify(res));
      // При отключении игрока закрываем комнату всем
      client.onclose = () => {
        rooms[roomId]?.map((user: WsClient) =>
          user.send(
            JSON.stringify({
              type: WSres.STOP_GAME,
              payload: {},
            }),
          ),
        );

        delete rooms[roomId];
      };
    });
  } catch (error) {
    console.log(error);
  }
};

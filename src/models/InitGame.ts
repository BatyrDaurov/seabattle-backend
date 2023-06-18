import { WsClient } from '../@types/WSClient.js';
import { marvel } from '../constants/marvel.js';

export default (ws: WsClient, rooms: any, roomId: number) => {
  let randomName = marvel[Math.floor(Math.random() * 10)]; // Выбираем случайное имя
  // Initial User State
  ws.userData = {
    name: randomName,
    matrix: [],
    shots: [],
    ready: false,
    roomId,
    turn: false,
    wonPrevGame: false,
  };

  if (rooms[roomId] && rooms[roomId].length === 2) return;
  // Добавляем пользователя в массив комнаты
  if (rooms[roomId] && rooms[roomId].length < 2) {
    while (rooms[roomId][0].userData.name === randomName) {
      randomName = marvel[Math.floor(Math.random() * 10)];
      ws.userData.name = randomName;
    }
    rooms[roomId].push(ws);
  }
  // Создаем массив комнаты
  if (!rooms[roomId]) {
    ws.userData.turn = true;
    rooms[roomId] = [ws];
  }
};

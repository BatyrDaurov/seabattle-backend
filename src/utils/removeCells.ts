import { ShipType } from '../@types/ShipType.js';
import { ShotType } from '../@types/ShotType.js';
import { isValidCoordinates } from './isValidCoordinates.js';

export const removeDiagonal = (x: number, y: number, ships: ShipType[] | undefined) => {
  const otherShots: ShotType[] = [];
  const ship = ships?.find((ship) => ship.range.find((shot) => shot.x === x && shot.y === y));

  // Для кораблей длиной > 1, удаляем соседние ячейки по диагонали
  for (let i = y - 1; i < y + 2; i++) {
    if (ship?.length !== 1 && i === y) continue; // Если длина корабля 1, то удаляем и ячейки сверху
    if (i < 0 || i > 9) continue;
    for (let j = x - 1; j < x + 2; j++) {
      if (ship?.length !== 1 && j === x) continue; // Если длина корабля 1, то удаляем и ячейки по бокам
      if (j < 0 || j > 9) continue;
      otherShots.push({
        x: j,
        y: i,
        isHitted: false,
      });
    }
  }
  // После потопления корабля, удаляем оставшийся ячейки сверху/снизу, справа/слева
  if (ship && ship.range.every((shot) => shot.isHitted === true)) {
    const shipX1 = isValidCoordinates(ship.x - 1); // Ячейка слева
    const shipX2 = isValidCoordinates(ship.x + ship.length); // Ячейка справа
    const shipY1 = isValidCoordinates(ship.y - 1); // Ячейка сверху
    const shipY2 = isValidCoordinates(ship.y + ship.length); // Ячейка снизу
    // ^^^^ Добавляем координаты, через цикл
    for (let i = 0; i < 2; i++) {
      if (i === 0) {
        if (ship.direction === 'row' && shipX1 === null) continue; // Если координата больше 10 / меньше 0, пропускаем
        if (ship.direction === 'column' && shipY1 === null) continue; // Если координата больше 10 / меньше 0, пропускаем
        otherShots.push({
          x: ship.direction === 'row' ? shipX1 : ship.x,
          y: ship.direction === 'row' ? ship.y : shipY1,
          isHitted: false,
        });
      } else {
        if (ship.direction === 'row' && shipX2 === null) continue; // Если координата больше 10 / меньше 0, пропускаем
        if (ship.direction === 'column' && shipY2 === null) continue; // Если координата больше 10 / меньше 0, пропускаем
        otherShots.push({
          x: ship.direction === 'row' ? shipX2 : ship.x,
          y: ship.direction === 'row' ? ship.y : shipY2,
          isHitted: false,
        });
      }
    }
  }
  // Очищаем массив от повторений
  let filteredArray = otherShots.reduce((result: ShotType[], item: ShotType) => {
    return result.includes(item) ? result : [...result, item];
  }, []);
  // Возвращаем массив без дубликатов
  return filteredArray;
};

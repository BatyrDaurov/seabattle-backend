import { ShotType } from './ShotType.js';

export type ShipType = {
  id: number;
  x: number;
  y: number;
  length: number;
  direction: 'row' | 'column';
  placed: boolean;
  destructure: number;
  range: ShotType[];
};

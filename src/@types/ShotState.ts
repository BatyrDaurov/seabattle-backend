import { WsClient } from './WSClient.js';

export type ShotState = {
  x: number;
  y: number;
  enemy: WsClient;
  shooted: boolean;
  responseShip: {
    isKilled: boolean;
    isHitted: boolean;
  };
};

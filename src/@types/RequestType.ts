import { WSreq } from '../constants/actions.js';

export type RequestType = {
  event: WSreq;
  payload: {
    name?: string;
    roomId: number;
    ships?: any[];
    sessionsCount?: number;
    sessionsData?: object;
    coordinates: {
      x: number;
      y: number;
    };
  };
};

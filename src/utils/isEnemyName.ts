import { WsClient } from '../@types/WSClient.js';

export const isEnemyName = (user1: WsClient, user2: WsClient) => {
  return user1.userData.name?.replace(' ', '') !== user2.userData.name?.replace(' ', '');
};

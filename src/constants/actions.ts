export enum WSreq {
  GET_SESSIONS = 'get-all-sessions',
  FIND_GAME = 'find-the-game',
  CONNECT_ROOM = 'connect-to-room',
  READY_TO_PLAY = 'ready-to-play',
  SHOOT = 'register-the-shoot',
  REVENGE = 'revenge-the-game',
  LOGOUT = 'logout',
}
export enum WSres {
  COMMAND_NOT_EXIST = 'commandNotExist',
  ERROR = 'error',
  STOP_GAME = 'stopGame',
  SEND_SESSIONS = 'takeSessions',
  CONNECT_ROOM = 'connectToRoom',
  GAME_FOUNDED = 'gameFound',
  READY_TO_PLAY = 'canStart',
  START_GAME = 'gameStarted',
  SHOOT = 'afterShoot',
  GAME_OVER = 'gameOver',
}

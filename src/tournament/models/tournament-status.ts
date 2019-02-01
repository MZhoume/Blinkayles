import { GameStatus } from './game-status';
import { Champion } from './champion';
import { StatusResult } from './status-result';

export class TournamentStatus {
  public time: Date;
  public finished: boolean;
  public games: StatusResult<GameStatus>[];
  public pastGames: StatusResult<GameStatus>[];
  public players: string[];
  public byes: string[];
  public championship?: Champion[];

  constructor(
    time: Date,
    finished: boolean,
    games: StatusResult<GameStatus>[],
    pastGames: StatusResult<GameStatus>[],
    players: string[],
    byes: string[],
    championship?: Champion[]
  ) {
    this.time = time;
    this.finished = finished;
    this.games = games;
    this.pastGames = pastGames;
    this.players = players;
    this.byes = byes;
    this.championship = championship;
  }
}

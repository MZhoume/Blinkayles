import { Champion } from './models/champion';
import { ceil2 } from '../helpers/math-helpers';
import { KaylesGame } from './kayles-game';
import { TournamentStatus } from './models/tournament-status';
import { InvalidTournamentException } from '../exceptions/invalid-tournament.exception';
import { generate } from 'shortid';
import { StatusResult } from './models/status-result';
import { GameStatus } from './models/game-status';

export class Tournament {
  public time: Date;
  public finished: boolean;

  private rowLength: number;
  private players: string[];
  private byes: string[];
  private games: { [id: string]: KaylesGame };
  private pastGames: { [id: string]: KaylesGame };
  private championship?: Champion[];

  constructor(players: string[], rowLength: number = 10) {
    if (players.length < 2 || rowLength < 1) {
      throw new InvalidTournamentException();
    }

    // make a copy of the original players array so shuffling won't affect its caller
    const _players = [...players];
    _players.sort(() => 0.5 - Math.random());

    this.time = new Date();
    this.finished = false;

    this.rowLength = rowLength;
    const byeNums = ceil2(_players.length) - _players.length;
    this.byes = _players.slice(0, byeNums);
    this.players = _players.slice(byeNums);
    this.games = this.startNewRound(this.players, this.rowLength);
    this.pastGames = {};
  }

  public getStatus(): TournamentStatus {
    const games = Object.keys(this.games).map(
      k => new StatusResult<GameStatus>(k, this.games[k].getStatus())
    );
    const pastGames = Object.keys(this.pastGames).map(
      k => new StatusResult<GameStatus>(k, this.pastGames[k].getStatus())
    );

    return new TournamentStatus(
      this.time,
      this.finished,
      games,
      pastGames,
      this.players,
      this.byes,
      this.championship
    );
  }

  public getGame(id: string): KaylesGame | undefined {
    return this.games[id] || this.pastGames[id];
  }

  public updateTournament(): void {
    if (this.finished) {
      return;
    }

    const gameSummary = Object.keys(this.games).map(k => ({
      id: k,
      game: this.games[k]
    }));
    if (gameSummary.every(s => s.game.finished)) {
      if (gameSummary.length === 1 && this.byes.length === 0) {
        this.finished = true;
        this.players = [];
        Object.assign(this.pastGames, this.games);
        this.games = {};
        this.championship = [
          {
            place: 1,
            player: <string>gameSummary[0].game.getWinner()
          },
          {
            place: 2,
            player: <string>gameSummary[0].game.getRunnerUp()
          }
        ];
      } else {
        const players = gameSummary.map(s => <string>s.game.getWinner());
        this.players = [...players];
        if (this.byes.length > 0) {
          this.players.push(...this.byes);
          this.byes = [];
        }

        Object.assign(this.pastGames, this.games);
        this.games = this.startNewRound(this.players, this.rowLength);
      }
    }
  }

  private startNewRound(
    players: string[],
    rowLength: number
  ): { [id: string]: KaylesGame } {
    const games: { [id: string]: KaylesGame } = {};

    for (let i = 0; i < players.length; i += 2) {
      const id = generate();
      games[id] = new KaylesGame([players[i], players[i + 1]], rowLength);
    }

    return games;
  }
}

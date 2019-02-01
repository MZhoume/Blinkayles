import { InvalidGameException } from '../exceptions/invalid-game.exception';
import { InvalidTurnException } from '../exceptions/invalid-turn.exception';
import { InvalidMoveException } from '../exceptions/invalid-move.exception';
import { GameStatus } from './models/game-status';

export class KaylesGame {
  public time: Date;
  public finished: boolean;

  private players: string[];
  private row: boolean[];
  private currPlayerIndex: 0 | 1;

  constructor(players: string[], rowLength: number = 10) {
    if (players.length !== 2 || rowLength < 1) {
      throw new InvalidGameException();
    }

    this.time = new Date();
    this.finished = false;

    this.players = players;
    this.row = Array.from({ length: rowLength }).map(() => true);
    this.currPlayerIndex = 0;
  }

  public makeMove(player: string, index1: number, index2?: number): void {
    if (this.finished || this.players[this.currPlayerIndex] !== player) {
      throw new InvalidTurnException();
    }

    this.knockdown(index1, index2);
    this.updateTurn();
  }

  public getWinner(): string | undefined {
    if (this.finished) {
      return this.players[this.currPlayerIndex];
    }

    return undefined;
  }

  public getRunnerUp(): string | undefined {
    if (this.finished) {
      return this.players[this.currPlayerIndex === 0 ? 1 : 0];
    }

    return undefined;
  }

  public getStatus(): GameStatus {
    return new GameStatus(
      this.time,
      this.finished,
      this.players,
      this.getRowString(),
      this.finished ? undefined : this.players[this.currPlayerIndex],
      this.getWinner()
    );
  }

  public getRowString(): string {
    return this.row.map(x => (x ? '!' : 'x')).join('');
  }

  private updateTurn(): void {
    if (this.getPinsLeft() === 0) {
      this.finished = true;
    } else {
      this.currPlayerIndex = this.currPlayerIndex === 0 ? 1 : 0;
    }
  }

  private knockdown(index1: number, index2?: number): void {
    if (!this.row[index1]) {
      throw new InvalidMoveException();
    }

    this.row[index1] = false;

    if (index2) {
      if (!this.row[index2] || Math.abs(index1 - index2) !== 1) {
        throw new InvalidMoveException();
      }

      this.row[index2] = false;
    }
  }

  private getPinsLeft(): number {
    return this.finished ? 0 : this.row.filter(p => p).length;
  }
}

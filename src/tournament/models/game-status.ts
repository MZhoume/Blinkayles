export class GameStatus {
  public time: Date;
  public finished: boolean;
  public players: string[];
  public currentPlayer?: string;
  public row: string;
  public winner?: string;

  constructor(
    time: Date,
    finished: boolean,
    players: string[],
    row: string,
    currPlayer?: string,
    winner?: string
  ) {
    this.time = time;
    this.finished = finished;
    this.players = players;
    this.currentPlayer = currPlayer;
    this.row = row;
    this.winner = winner;
  }
}

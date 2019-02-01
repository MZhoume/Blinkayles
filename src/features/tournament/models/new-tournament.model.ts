import { ArrayNotEmpty, ArrayMinSize, ArrayUnique } from 'class-validator';

export class NewTournamentModel {
  @ArrayNotEmpty()
  @ArrayMinSize(2)
  @ArrayUnique()
  public players: string[];

  constructor(players: string[] = []) {
    this.players = players;
  }
}

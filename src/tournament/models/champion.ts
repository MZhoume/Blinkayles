export class Champion {
  public player: string;
  public place: 1 | 2;

  constructor(player: string, place: 1 | 2) {
    this.player = player;
    this.place = place;
  }
}

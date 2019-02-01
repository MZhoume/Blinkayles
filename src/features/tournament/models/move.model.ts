import {
  IsNotEmpty,
  ArrayNotEmpty,
  ArrayUnique,
  ArrayMinSize,
  ArrayMaxSize
} from 'class-validator';

export class MoveModel {
  @IsNotEmpty()
  public player: string;

  @ArrayNotEmpty()
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  public pins: number[];

  constructor(player: string = '', pins: number[] = []) {
    this.player = player;
    this.pins = pins;
  }
}

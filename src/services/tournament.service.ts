import { injectable } from 'inversify';
import { ITournamentService } from './abstractions/itournament.service';
import { Tournament } from '../tournament/tournament';
import { TournamentStatus } from '../tournament/models/tournament-status';
import { generate } from 'shortid';
import { StatusResult } from '../tournament/models/status-result';

@injectable()
export class TournamentService implements ITournamentService {
  private tournaments: { [id: string]: Tournament };

  constructor() {
    this.tournaments = {};
  }

  public startNewTournament(players: string[], rowLength: number = 10): string {
    const id = generate();
    const tournament = new Tournament(players, rowLength);

    this.tournaments[id] = tournament;

    return id;
  }

  public getTournament(id: string): Tournament | undefined {
    return this.tournaments[id];
  }

  public getAllTournamentStatus(): StatusResult<TournamentStatus>[] {
    return Object.keys(this.tournaments).map(
      k =>
        new StatusResult<TournamentStatus>(k, this.tournaments[k].getStatus())
    );
  }
}

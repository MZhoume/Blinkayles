import { StatusResult } from '../../../tournament/models/status-result';
import { TournamentStatus } from '../../../tournament/models/tournament-status';

export class TournamentsStatus {
  public tournaments: StatusResult<TournamentStatus>[];
  public pastTournaments: StatusResult<TournamentStatus>[];

  constructor(
    tournaments: StatusResult<TournamentStatus>[],
    pastTournaments: StatusResult<TournamentStatus>[]
  ) {
    this.tournaments = tournaments;
    this.pastTournaments = pastTournaments;
  }
}

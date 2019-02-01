import { Tournament } from '../../tournament/tournament';
import { TournamentStatus } from '../../tournament/models/tournament-status';
import { StatusResult } from '../../tournament/models/status-result';

export interface ITournamentService {
  startNewTournament(players: string[], rowLength: number): string;

  getTournament(id: string): Tournament | undefined;

  getAllTournamentStatus(): StatusResult<TournamentStatus>[];
}

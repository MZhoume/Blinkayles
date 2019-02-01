import assert from 'assert';
import 'reflect-metadata';
import { TournamentService } from '../../services/tournament.service';
import { TournamentController } from './tournament.controller';

describe('tournament controller', () => {
  let tournamentService: TournamentService;
  let id: string;

  beforeEach(() => {
    tournamentService = new TournamentService();
    id = tournamentService.startNewTournament(['player1', 'player2']);
  });

  it('should get tournament status with valid id', async () => {
    const controller = new TournamentController(tournamentService);
    const res = await controller.getTournamentStatus(id).executeAsync();

    assert.strictEqual(res.statusCode, 200);
  });

  it('should not get tournament status with invalid id', async () => {
    const controller = new TournamentController(tournamentService);
    const res = await controller
      .getTournamentStatus('invalid-id')
      .executeAsync();

    assert.strictEqual(res.statusCode, 404);
  });
});

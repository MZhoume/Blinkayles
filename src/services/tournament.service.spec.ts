import assert from 'assert';
import 'reflect-metadata';
import { TournamentService } from './tournament.service';

describe('tournament service', () => {
  it('should start new tournament with valid input', () => {
    const service = new TournamentService();
    const id = service.startNewTournament(['player1', 'player2']);

    assert.ok(id);
  });

  it('should get tournament with valid id', () => {
    const service = new TournamentService();
    const id = service.startNewTournament(['player1', 'player2']);
    const tournament = service.getTournament(id)!;

    assert.ok(!tournament.finished);
  });

  it('should not get tournament with invalid id', () => {
    const service = new TournamentService();
    const tournament = service.getTournament('invalid-id');

    assert.ok(!tournament);
  });

  it('should get all tournament status', () => {
    const service = new TournamentService();
    const id = service.startNewTournament(['player1', 'player2']);
    const allStatus = service.getAllTournamentStatus();

    assert.strictEqual(allStatus[0].id, id);

    const status = allStatus[0].status;

    assert.ok(!status.finished);
  });
});

import assert from 'assert';
import 'reflect-metadata';
import { TournamentService } from '../../services/tournament.service';
import { TournamentsController } from './tournaments.controller';
import { NewTournamentModel } from './models/new-tournament.model';
import { validate } from 'class-validator';
import { TournamentsStatus } from './models/tournaments-status';

describe('tournaments controller', () => {
  let tournamentService: TournamentService;

  beforeEach(() => {
    tournamentService = new TournamentService();
  });

  it('should start new tournament with valid input', async () => {
    const controller = new TournamentsController(tournamentService);
    const model = new NewTournamentModel(['player1', 'player2']);
    const res = await (await controller.startNewTournament(
      model
    )).executeAsync();
    const id = JSON.parse(await res.content.readAsStringAsync()).id;

    assert.strictEqual(res.statusCode, 201);
    assert.ok(id);
  });

  it('should not start new tournament with invalid input', async () => {
    const controller = new TournamentsController(tournamentService);
    const model = new NewTournamentModel(['player1']);
    const error = await validate(model);

    assert.strictEqual(error.length, 1);
  });

  it('should be able to get all tournament status', async () => {
    const controller = new TournamentsController(tournamentService);
    const model = new NewTournamentModel(['player1', 'player2']);
    let res = await (await controller.startNewTournament(model)).executeAsync();
    const id = JSON.parse(await res.content.readAsStringAsync()).id;

    res = await controller.getAllTournamentStatus().executeAsync();
    const status = <TournamentsStatus>(
      JSON.parse(await res.content.readAsStringAsync())
    );

    assert.strictEqual(res.statusCode, 200);
    assert.ok(status.tournaments.map(s => s.id).includes(id));
  });
});

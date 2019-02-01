import assert from 'assert';
import 'reflect-metadata';
import { TournamentService } from '../../services/tournament.service';
import { GameController } from './game.controller';
import { InvalidTurnException } from '../../exceptions/invalid-turn.exception';
import { InvalidMoveException } from '../../exceptions/invalid-move.exception';
import { MoveModel } from './models/move.model';
import { validate } from 'class-validator';

describe('game controller', () => {
  let tournamentService: TournamentService;
  let tournamentId: string;
  let gameId: string;

  beforeEach(() => {
    tournamentService = new TournamentService();
    tournamentId = tournamentService.startNewTournament(['player1', 'player2']);
    gameId = tournamentService.getTournament(tournamentId)!.getStatus().games[0]
      .id;
  });

  it('should get game status with valid id', async () => {
    const controller = new GameController(tournamentService);
    const res = await controller
      .getGameStatus(tournamentId, gameId)
      .executeAsync();

    assert.strictEqual(res.statusCode, 200);
  });

  it('should not get game status with invalid id', async () => {
    const controller = new GameController(tournamentService);
    let res = await controller
      .getGameStatus(tournamentId, 'invalid-id')
      .executeAsync();

    assert.strictEqual(res.statusCode, 404);

    res = await controller.getGameStatus('invalid-id', gameId).executeAsync();

    assert.strictEqual(res.statusCode, 404);
  });

  it('should make move with valid input', async () => {
    const controller = new GameController(tournamentService);
    const [player1, player2] = tournamentService
      .getTournament(tournamentId)!
      .getStatus().players;
    let model = new MoveModel(player1, [0]);
    let res = await (await controller.makeMove(
      tournamentId,
      gameId,
      model
    )).executeAsync();

    assert.strictEqual(res.statusCode, 200);

    model = new MoveModel(player2, [1, 2]);
    res = await (await controller.makeMove(
      tournamentId,
      gameId,
      model
    )).executeAsync();

    assert.strictEqual(res.statusCode, 200);
  });

  it('should not make move with invalid input', async () => {
    const controller = new GameController(tournamentService);
    const [player1, player2] = tournamentService
      .getTournament(tournamentId)!
      .getStatus().players;
    let model = new MoveModel(player1, []);
    let error = await validate(model);

    assert.strictEqual(error.length, 1);

    model = new MoveModel(player1, [1, 2, 3]);
    error = await validate(model);

    assert.strictEqual(error.length, 1);

    model = new MoveModel(player2, [1]);

    assert.rejects(
      async () =>
        await (await controller.makeMove(
          tournamentId,
          gameId,
          model
        )).executeAsync(),
      InvalidTurnException
    );

    model = new MoveModel(player1, [1, 3]);

    assert.rejects(
      async () =>
        await (await controller.makeMove(
          tournamentId,
          gameId,
          model
        )).executeAsync(),
      InvalidMoveException
    );
  });
});

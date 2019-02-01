import assert from 'assert';
import 'reflect-metadata';
import { Tournament } from './tournament';
import { InvalidTournamentException } from '../exceptions/invalid-tournament.exception';

describe('tournament', () => {
  it('should start tournament with valid input', () => {
    const players = ['player1', 'player2'];
    const tournament = new Tournament(players);
    const status = tournament.getStatus();

    assert.ok(!status.finished);
    assert.strictEqual(status.games.length, 1);
    assert.strictEqual(status.pastGames.length, 0);
    assert.strictEqual(status.byes.length, 0);
    assert.strictEqual(status.championship, undefined);
  });

  it('should not start tournament with invalid input', () => {
    assert.throws(
      () => new Tournament(['player1']),
      InvalidTournamentException
    );
    assert.throws(
      () => new Tournament(['player1'], 0),
      InvalidTournamentException
    );
  });

  it('should get name by valid id', () => {
    const tournament = new Tournament(['player1', 'player2']);
    let status = tournament.getStatus();
    const gameId = status.games[0].id;

    let game = tournament.getGame(gameId)!;

    assert.ok(game);

    const player1 = status.players[0];
    const player2 = status.players[1];

    assert.ok(!status.finished);

    game.makeMove(player1, 0, 1);
    tournament.updateTournament();
    game.makeMove(player2, 2, 3);
    tournament.updateTournament();
    game.makeMove(player1, 4, 5);
    tournament.updateTournament();
    game.makeMove(player2, 6, 7);
    tournament.updateTournament();
    game.makeMove(player1, 8);
    tournament.updateTournament();
    game.makeMove(player2, 9);
    tournament.updateTournament();

    status = tournament.getStatus();
    game = tournament.getGame(gameId)!;

    assert.ok(status.finished);
    assert.ok(game);
    assert.strictEqual(status.games.length, 0);
    assert.strictEqual(status.pastGames.length, 1);
    assert.strictEqual(status.pastGames[0].id, gameId);
  });

  it('should not get game by invalid id', () => {
    const tournament = new Tournament(['player1', 'player2']);
    const game = tournament.getGame('invalid-id')!;
    assert.ok(!game);
  });

  it('should finish tournament when all games finished', () => {
    const tournament = new Tournament(['player1', 'player2']);
    let status = tournament.getStatus();
    const gameId = status.games[0].id;
    const game = tournament.getGame(gameId)!;
    const player1 = status.players[0];
    const player2 = status.players[1];

    assert.ok(!status.finished);

    game.makeMove(player1, 0, 1);
    tournament.updateTournament();
    game.makeMove(player2, 2, 3);
    tournament.updateTournament();
    game.makeMove(player1, 4, 5);
    tournament.updateTournament();
    game.makeMove(player2, 6, 7);
    tournament.updateTournament();
    game.makeMove(player1, 8);
    tournament.updateTournament();
    game.makeMove(player2, 9);
    tournament.updateTournament();

    status = tournament.getStatus();
    assert.ok(status.finished);
    assert.strictEqual(status.players.length, 0);
    assert.strictEqual(status.byes.length, 0);
    assert.strictEqual(status.games.length, 0);
    assert.strictEqual(status.pastGames.length, 1);
    assert.deepStrictEqual(status.championship, [
      { place: 1, player: player2 },
      { place: 2, player: player1 }
    ]);
  });

  it('should start new round when current round finished', () => {
    const tournament = new Tournament(['player1', 'player2', 'player3']);
    let status = tournament.getStatus();

    assert.ok(!status.finished);
    assert.strictEqual(status.players.length, 2);
    assert.strictEqual(status.byes.length, 1);
    assert.strictEqual(status.games.length, 1);
    assert.strictEqual(status.pastGames.length, 0);
    assert.strictEqual(status.championship, undefined);

    let gameId = status.games[0].id;
    let game = tournament.getGame(gameId)!;

    let player1 = status.players[0];
    let player2 = status.players[1];

    game.makeMove(player1, 0, 1);
    tournament.updateTournament();
    game.makeMove(player2, 2, 3);
    tournament.updateTournament();
    game.makeMove(player1, 4, 5);
    tournament.updateTournament();
    game.makeMove(player2, 6, 7);
    tournament.updateTournament();
    game.makeMove(player1, 8);
    tournament.updateTournament();
    game.makeMove(player2, 9);
    tournament.updateTournament();

    status = tournament.getStatus();
    assert.ok(!status.finished);
    assert.strictEqual(status.players.length, 2);
    assert.strictEqual(status.byes.length, 0);
    assert.strictEqual(status.games.length, 1);
    assert.strictEqual(status.pastGames.length, 1);
    assert.strictEqual(status.championship, undefined);

    gameId = status.games[0].id;
    game = tournament.getGame(gameId)!;

    player1 = status.players[0];
    player2 = status.players[1];

    game.makeMove(player1, 0, 1);
    tournament.updateTournament();
    game.makeMove(player2, 2, 3);
    tournament.updateTournament();
    game.makeMove(player1, 4, 5);
    tournament.updateTournament();
    game.makeMove(player2, 6, 7);
    tournament.updateTournament();
    game.makeMove(player1, 8);
    tournament.updateTournament();
    game.makeMove(player2, 9);
    tournament.updateTournament();

    status = tournament.getStatus();
    assert.ok(status.finished);
    assert.strictEqual(status.players.length, 0);
    assert.strictEqual(status.byes.length, 0);
    assert.strictEqual(status.games.length, 0);
    assert.strictEqual(status.pastGames.length, 2);
    assert.deepStrictEqual(status.championship, [
      { place: 1, player: player2 },
      { place: 2, player: player1 }
    ]);
  });
});

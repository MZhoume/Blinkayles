import assert from 'assert';
import 'reflect-metadata';
import { KaylesGame } from './kayles-game';
import { InvalidGameException } from '../exceptions/invalid-game.exception';
import { InvalidMoveException } from '../exceptions/invalid-move.exception';
import { InvalidTurnException } from '../exceptions/invalid-turn.exception';

describe('kayles game', () => {
  it('should start game for valid input', () => {
    const game = new KaylesGame(['player1', 'player2'], 10);

    assert.ok(!game.finished);
    assert.strictEqual(game.getRowString(), '!!!!!!!!!!');
  });

  it('should not start game for invalid input', () => {
    assert.throws(
      () => new KaylesGame(['player1', 'player2', 'player3']),
      InvalidGameException
    );
    assert.throws(() => new KaylesGame(['player1']), InvalidGameException);
    assert.throws(
      () => new KaylesGame(['player1', 'player2'], 0),
      InvalidGameException
    );
  });

  it('should let valid user make move', () => {
    const game = new KaylesGame(['player1', 'player2']);

    game.makeMove('player1', 0);
    assert.strictEqual(game.getRowString(), 'x!!!!!!!!!');

    game.makeMove('player2', 9);
    assert.strictEqual(game.getRowString(), 'x!!!!!!!!x');
  });

  it('should not let invalid user make move', () => {
    const game = new KaylesGame(['player1', 'player2']);

    assert.throws(() => game.makeMove('player2', 0), InvalidTurnException);
  });

  it('should not allow invalid move', () => {
    const game = new KaylesGame(['player1', 'player2']);

    game.makeMove('player1', 9);
    assert.throws(() => game.makeMove('player1', 9), InvalidTurnException);
    assert.throws(() => game.makeMove('player2', 9), InvalidMoveException);
    assert.throws(() => game.makeMove('player2', 2, 4), InvalidMoveException);
  });

  it('should finish game when all pins are down', () => {
    const game = new KaylesGame(['player1', 'player2']);

    game.makeMove('player1', 0, 1);
    assert.strictEqual(game.getRowString(), 'xx!!!!!!!!');
    assert.ok(!game.finished);
    assert.strictEqual(game.getWinner(), undefined);
    assert.strictEqual(game.getRunnerUp(), undefined);

    game.makeMove('player2', 2, 3);
    assert.strictEqual(game.getRowString(), 'xxxx!!!!!!');
    assert.ok(!game.finished);
    assert.strictEqual(game.getWinner(), undefined);
    assert.strictEqual(game.getRunnerUp(), undefined);

    game.makeMove('player1', 4, 5);
    assert.strictEqual(game.getRowString(), 'xxxxxx!!!!');
    assert.ok(!game.finished);
    assert.strictEqual(game.getWinner(), undefined);
    assert.strictEqual(game.getRunnerUp(), undefined);

    game.makeMove('player2', 6, 7);
    assert.strictEqual(game.getRowString(), 'xxxxxxxx!!');
    assert.ok(!game.finished);
    assert.strictEqual(game.getWinner(), undefined);
    assert.strictEqual(game.getRunnerUp(), undefined);

    game.makeMove('player1', 8);
    assert.strictEqual(game.getRowString(), 'xxxxxxxxx!');
    assert.ok(!game.finished);
    assert.strictEqual(game.getWinner(), undefined);
    assert.strictEqual(game.getRunnerUp(), undefined);

    game.makeMove('player2', 9);
    assert.strictEqual(game.getRowString(), 'xxxxxxxxxx');
    assert.ok(game.finished);
    assert.strictEqual(game.getWinner(), 'player2');
    assert.strictEqual(game.getRunnerUp(), 'player1');
  });
});

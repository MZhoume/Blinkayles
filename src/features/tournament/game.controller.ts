import {
  BaseHttpController,
  controller,
  httpGet,
  requestParam,
  interfaces,
  httpPost,
  requestBody
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Tokens } from '../../service-container';
import { TournamentService } from '../../services/tournament.service';
import { MoveModel } from './models/move.model';
import { KaylesGame } from '../../tournament/kayles-game';
import { Tournament } from '../../tournament/tournament';
import { validatorFor } from '../../middleware/validator.middleware';

@controller('/tournaments/:tournamentId/games/:gameId')
export class GameController extends BaseHttpController {
  constructor(
    @inject(Tokens.TOURNAMENT_SERVICE)
    private tournamentService: TournamentService
  ) {
    super();
  }

  @httpGet('')
  public getGameStatus(
    @requestParam('tournamentId') tournamentId: string,
    @requestParam('gameId') gameId: string
  ): interfaces.IHttpActionResult {
    const val = this.tryGetGame(tournamentId, gameId);
    if (!val) {
      return this.notFound();
    }

    const game = val.game;

    return this.ok(game.getStatus());
  }

  @httpPost('/moves', validatorFor(MoveModel))
  public async makeMove(
    @requestParam('tournamentId') tournamentId: string,
    @requestParam('gameId') gameId: string,
    @requestBody() model: MoveModel
  ): Promise<interfaces.IHttpActionResult> {
    const val = this.tryGetGame(tournamentId, gameId);
    if (!val) {
      return this.notFound();
    }

    const { tournament, game } = val;

    if (model.pins.length === 1) {
      game.makeMove(model.player, model.pins[0]);
    } else {
      game.makeMove(model.player, model.pins[0], model.pins[1]);
    }
    tournament.updateTournament();

    return this.ok(game.getStatus());
  }

  private tryGetGame(
    tournamentId: string,
    gameId: string
  ): { tournament: Tournament; game: KaylesGame } | undefined {
    const tournament = this.tournamentService.getTournament(tournamentId);
    if (!tournament) {
      return undefined;
    }

    const game = tournament.getGame(gameId);
    if (!game) {
      return undefined;
    }

    return { tournament, game };
  }
}

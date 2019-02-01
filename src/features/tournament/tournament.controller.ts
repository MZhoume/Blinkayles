import {
  BaseHttpController,
  controller,
  httpGet,
  requestParam,
  interfaces
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Tokens } from '../../service-container';
import { TournamentService } from '../../services/tournament.service';

@controller('/tournaments/:tournamentId')
export class TournamentController extends BaseHttpController {
  constructor(
    @inject(Tokens.TOURNAMENT_SERVICE)
    private tournamentService: TournamentService
  ) {
    super();
  }

  @httpGet('')
  public getTournamentStatus(
    @requestParam('tournamentId') tournamentId: string
  ): interfaces.IHttpActionResult {
    const tournament = this.tournamentService.getTournament(tournamentId);

    if (!tournament) {
      return this.notFound();
    }

    return this.ok(tournament.getStatus());
  }
}

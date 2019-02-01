import {
  BaseHttpController,
  controller,
  httpPost,
  interfaces,
  requestBody,
  httpGet
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Tokens } from '../../service-container';
import { TournamentService } from '../../services/tournament.service';
import { NewTournamentModel } from './models/new-tournament.model';
import { validatorFor } from '../../middleware/validator.middleware';
import { TournamentsStatus } from './models/tournaments-status';

@controller('/tournaments')
export class TournamentsController extends BaseHttpController {
  constructor(
    @inject(Tokens.TOURNAMENT_SERVICE)
    private tournamentService: TournamentService
  ) {
    super();
  }

  @httpPost('', validatorFor(NewTournamentModel))
  public async startNewTournament(
    @requestBody() model: NewTournamentModel
  ): Promise<interfaces.IHttpActionResult> {
    const id = this.tournamentService.startNewTournament(model.players);
    return this.created(`/tournaments/${id}`, { id });
  }

  @httpGet('')
  public getAllTournamentStatus(): interfaces.IHttpActionResult {
    const status = this.tournamentService.getAllTournamentStatus();
    const tournaments = status.filter(t => !t.status.finished);
    const pastTournaments = status.filter(t => t.status.finished);

    return this.ok(new TournamentsStatus(tournaments, pastTournaments));
  }
}

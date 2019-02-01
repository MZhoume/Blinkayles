import { Container } from 'inversify';
import { ITournamentService } from './services/abstractions/itournament.service';
import { TournamentService } from './services/tournament.service';

export const Tokens = {
  TOURNAMENT_SERVICE: 'TOURNAMENT_SERVICE'
};

export function getServiceContainer(): Container {
  const container = new Container();
  container
    .bind<ITournamentService>(Tokens.TOURNAMENT_SERVICE)
    .to(TournamentService)
    .inSingletonScope();

  return container;
}

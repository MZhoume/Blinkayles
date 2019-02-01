import {
  controller,
  interfaces,
  httpGet,
  BaseHttpController
} from 'inversify-express-utils';

@controller('/')
export class HomeController extends BaseHttpController {
  @httpGet('')
  public index(): interfaces.IHttpActionResult {
    return this.ok({ hello: 'blink' });
  }
}

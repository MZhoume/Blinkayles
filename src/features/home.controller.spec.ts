import assert from 'assert';
import 'reflect-metadata';
import { HomeController } from './home.controller';

describe('home controller', () => {
  it('should return welcome message', async () => {
    const home = new HomeController();
    const res = await home.index().executeAsync();

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(
      await res.content.readAsStringAsync(),
      JSON.stringify({ hello: 'blink' })
    );
  });
});

import assert from 'assert';
import 'reflect-metadata';
import { ceil2 } from './math-helpers';

describe('math helpers', () => {
  it('should ceiling to nearest power of 2', () => {
    const number = 5;
    const ceil = ceil2(number);

    assert.strictEqual(ceil, 8);
  });
});

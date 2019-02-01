import assert from 'assert';
import 'reflect-metadata';
import { SerializableException } from './serializable.exception';

describe('serializable exception', () => {
  it('should serialize its properties', () => {
    class TestException extends SerializableException {}

    const ex = new TestException('Test message');
    assert.strictEqual(
      JSON.stringify(ex),
      JSON.stringify({ message: 'Test message', name: 'TestException' })
    );
  });
});

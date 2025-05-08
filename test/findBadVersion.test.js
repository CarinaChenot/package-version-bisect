import * as assert from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';
import { findBadVersion } from '../src/findBadVersion.js';

describe('findBadVersion', () => {
  let installVersionMock;
  let promptMock;

  beforeEach(() => {
    installVersionMock = mock.fn();
    promptMock = mock.fn();
  });

  it('should return the correct bad version', async () => {
    const versions = ['1.0.0', '1.1.0', '1.2.0', '1.3.0', '1.4.0'];

    // versions '1.3.0' and up are bad
    promptMock.mock.mockImplementationOnce(() => Promise.resolve(false));
    promptMock.mock.mockImplementationOnce(() => Promise.resolve(true));

    const result = await findBadVersion(
      versions,
      installVersionMock,
      promptMock,
    );

    assert.strictEqual(result, '1.3.0');
    assert.strictEqual(installVersionMock.mock.callCount(), 2);
    assert.strictEqual(promptMock.mock.callCount(), 2);
    assert.deepStrictEqual(promptMock.mock.calls[0].arguments, ['1.2.0']);
    assert.deepStrictEqual(promptMock.mock.calls[1].arguments, ['1.3.0']);
    assert.deepStrictEqual(installVersionMock.mock.calls[0].arguments, [
      '1.2.0',
    ]);
    assert.deepStrictEqual(installVersionMock.mock.calls[1].arguments, [
      '1.3.0',
    ]);
  });

  it('should handle single-version list gracefully', async () => {
    const versions = ['1.0.0'];

    promptMock.mock.mockImplementationOnce(() => Promise.resolve(true));

    const result = await findBadVersion(
      versions,
      installVersionMock,
      promptMock,
    );

    assert.strictEqual(result, '1.0.0');
    assert.strictEqual(installVersionMock.mock.callCount(), 0);
    assert.strictEqual(promptMock.mock.callCount(), 0);
  });

  it('should throw on empty list', async () => {
    const versions = [];

    await assert.rejects(
      findBadVersion(versions, installVersionMock, promptMock),
      {
        name: 'Error',
        message: 'Empty versions list',
      },
    );
  });
});

import * as assert from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';
import { getVersions } from '../src/getVersions.js';

describe('getVersions', () => {
  let execMock;

  const output = `
  [
    "1.2.0",
    "2.0.0-rc.1",
    "1.5.3",
    "3.0.0",
    "2.1.0-rc.2",
    "0.9.8",
    "1.2.1",
    "2.0.0",
    "1.4.0-rc.3",
    "1.3.9",
    "3.1.0",
    "2.5.0",
    "1.0.0",
    "3.0.0-rc.1"
  ]`;

  beforeEach(() => {
    execMock = mock.fn();
  });

  it('should return versions of a package between two versions', async () => {
    execMock.mock.mockImplementationOnce(() => output);

    const result = getVersions('test-package', '1.0.0', '2.5.0', execMock);

    assert.deepStrictEqual(result, [
      '1.2.0',
      '1.2.1',
      '1.3.9',
      '1.5.3',
      '2.0.0',
    ]);
    assert.strictEqual(execMock.mock.callCount(), 1);
    assert.deepStrictEqual(execMock.mock.calls[0].arguments, [
      'npm view test-package versions --json',
    ]);
  });
});

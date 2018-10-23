import { expect } from 'chai';
import { getModuleLoader as getModuleLoaderMock, isNode } from 'emscripten-wasm-loader';
import { loadModule } from '../../src/loadModule';

const webcld3Mock = require('../../src/lib/cld3_web'); //tslint:disable-line:no-require-imports no-var-requires
const nodecld3Mock = require('../../src/lib/cld3_node'); //tslint:disable-line:no-require-imports no-var-requires

jest.mock('../../src/lib/cld3_web', () => jest.fn(), { virtual: true });
jest.mock('../../src/lib/cld3_node', () => jest.fn(), { virtual: true });
jest.mock('../../src/cldLoader');
jest.mock('emscripten-wasm-loader', () => ({
  isWasmEnabled: jest.fn(),
  isNode: jest.fn(),
  getModuleLoader: jest.fn(),
  ENVIRONMENT: {
    WEB: 'WEB',
    NODE: 'NODE'
  }
}));

describe('loadModule', () => {
  it('should create moduleLoader on browser', async () => {
    const mockModuleLoader = jest.fn();
    (isNode as jest.Mock).mockReturnValueOnce(false);

    (getModuleLoaderMock as jest.Mock).mockImplementationOnce((cb: Function) => {
      cb();
      return mockModuleLoader;
    });
    await loadModule();

    expect((getModuleLoaderMock as jest.Mock).mock.calls[0][1]).to.equal(webcld3Mock);
  });

  it('should create module on node', async () => {
    const mockModuleLoader = jest.fn();
    (isNode as jest.Mock).mockReturnValueOnce(true);

    (getModuleLoaderMock as jest.Mock).mockReturnValueOnce(mockModuleLoader);
    await loadModule();

    expect((getModuleLoaderMock as jest.Mock).mock.calls[0][1]).to.equal(nodecld3Mock);
  });
});

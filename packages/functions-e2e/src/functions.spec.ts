import * as path from 'path';
import {
  uniq,
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
} from '@nx/plugin/testing';
import { ensureNxLocalLibs, cleanLocalLibs } from '@aws-nx/utils';

describe('functions', () => {
  beforeAll(() => {
    ensureNxLocalLibs();
    ensureNxProject('@aws-nx/functions', 'dist/packages/functions');
  });

  afterAll(() => {
    cleanLocalLibs();
  });

  describe('Application Generator', () => {
    const projectName = uniq('functions-app');

    it('generate functions app', async () => {
      await runNxCommandAsync(`generate @aws-nx/functions:app ${projectName}`);
      expect(() => checkFilesExist(path.join(projectName))).toBeTruthy();
    }, 100000);

    it('generate function', async () => {
      const functionName = uniq('function');
      await runNxCommandAsync(
        `generate @aws-nx/functions:function ${functionName} --project ${projectName}`
      );
      expect(() =>
        checkFilesExist(`${projectName}/${functionName}`)
      ).toBeTruthy();
    }, 100000);
  });

  describe('Library Generator', () => {
    const projectName = uniq('functions-lib');

    it('generate functions lib', async () => {
      await runNxCommandAsync(`generate @aws-nx/functions:lib ${projectName}`);
      expect(() => checkFilesExist(path.join(projectName))).toBeTruthy();
    }, 100000);

    it('generate function', async () => {
      const functionName = uniq('function');
      await runNxCommandAsync(
        `generate @aws-nx/functions:function ${functionName} --project ${projectName}`
      );
      expect(() =>
        checkFilesExist(`${projectName}/${functionName}`)
      ).toBeTruthy();
    }, 100000);
  });

  describe('remove app/lib', () => {
    it('remove app', async () => {
      //
    });
  });
});

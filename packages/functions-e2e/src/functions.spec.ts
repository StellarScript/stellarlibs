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
    it('(error) generate existing app', async () => {
      const projectName = uniq('functions-app');

      await runNxCommandAsync(`generate @aws-nx/functions:app ${projectName}`);
      expect(() => checkFilesExist(path.join(projectName))).toBeTruthy();

      expect(() =>
        runNxCommandAsync(`generate @aws-nx/functions:app ${projectName}`)
      ).rejects.toThrow();
    });

    it('generate functions app', async () => {
      const projectName = uniq('functions-app');
      await runNxCommandAsync(`generate @aws-nx/functions:app ${projectName}`);
      expect(() => checkFilesExist(path.join(projectName))).toBeTruthy();
    }, 100000);

    it('generate function', async () => {
      const projectName = uniq('functions-app');
      const functionName = uniq('function');

      await runNxCommandAsync(`generate @aws-nx/functions:app ${projectName}`);
      await runNxCommandAsync(
        `generate @aws-nx/functions:function ${functionName} --project ${projectName}`
      );
      expect(() =>
        checkFilesExist(`${projectName}/${functionName}`)
      ).toBeTruthy();
    }, 100000);
  });

  describe('Library Generator', () => {
    it('(error) generate existing lib', async () => {
      const projectName = uniq('functions-lib');
      await runNxCommandAsync(`generate @aws-nx/functions:lib ${projectName}`);
      expect(() => checkFilesExist(path.join(projectName))).toBeTruthy();

      expect(() =>
        runNxCommandAsync(`generate @aws-nx/functions:lib ${projectName}`)
      ).rejects.toThrow();
    });

    it('generate functions lib', async () => {
      const projectName = uniq('functions-lib');
      await runNxCommandAsync(`generate @aws-nx/functions:lib ${projectName}`);
      expect(() => checkFilesExist(path.join(projectName))).toBeTruthy();
    }, 100000);

    it('generate function', async () => {
      const projectName = uniq('functions-lib');
      const functionName = uniq('function');

      await runNxCommandAsync(`generate @aws-nx/functions:lib ${projectName}`);
      await runNxCommandAsync(
        `generate @aws-nx/functions:function ${functionName} --project ${projectName}`
      );
      expect(() =>
        checkFilesExist(`${projectName}/${functionName}`)
      ).toBeTruthy();
    }, 100000);
  });

  describe('Function Generator', () => {
    const projectName = uniq('functions-app');
    const functionName = uniq('function');

    it('(error) generate function with none existing app', async () => {
      expect(() =>
        runNxCommandAsync(
          `generate @aws-nx/functions:function ${functionName} --project ${projectName}`
        )
      ).rejects.toThrow();
    }, 100000);

    it('generate function', async () => {
      await runNxCommandAsync(`generate @aws-nx/functions:app ${projectName}`);
      await runNxCommandAsync(
        `generate @aws-nx/functions:function ${functionName} --project ${projectName}`
      );
      expect(() => checkFilesExist(projectName)).toBeTruthy();
      expect(() =>
        checkFilesExist(`${projectName}/${functionName}`)
      ).toBeTruthy();
    }, 100000);
  });

  describe('remove app/lib', () => {
    it('(error) remove none existing app', async () => {
      expect(() =>
        runNxCommandAsync(
          `generate @aws-nx/functions:remove --project none-existing-app`
        )
      ).rejects.toThrow();
    });

    it('(error) remove none existing lib', async () => {
      expect(() =>
        runNxCommandAsync(
          `generate @aws-nx/functions:remove --project none-existing-lib`
        )
      ).rejects.toThrow();
    });

    it('(error) remove none existing function', async () => {
      const projectName = uniq('functions-app');
      await runNxCommandAsync(`generate @aws-nx/functions:app ${projectName}`);

      expect(() =>
        runNxCommandAsync(
          `generate @aws-nx/functions:remove --project ${projectName} --function none-existing-function`
        )
      ).rejects.toThrow();
    });

    it('remove app', async () => {
      const projectName = uniq('functions-app');

      await runNxCommandAsync(`generate @aws-nx/functions:app ${projectName}`);
      expect(() => checkFilesExist(projectName)).toBeTruthy();

      await runNxCommandAsync(
        `generate @aws-nx/functions:remove --project ${projectName}`
      );
      expect(() => checkFilesExist(projectName)).toThrow();
    }, 100000);

    it('remove function', async () => {
      const projectName = uniq('functions-app');
      const functionName = uniq('function');

      await runNxCommandAsync(`generate @aws-nx/functions:app ${projectName}`);
      await runNxCommandAsync(
        `generate @aws-nx/functions:function ${functionName} --project ${projectName}`
      );

      expect(() => checkFilesExist(projectName)).toBeTruthy();
      expect(() =>
        checkFilesExist(`${projectName}/${functionName}`)
      ).toBeTruthy();

      await runNxCommandAsync(
        `generate @aws-nx/functions:remove --project ${projectName} --function ${functionName}`
      );

      expect(() => checkFilesExist(projectName)).not.toThrow();
      expect(() => checkFilesExist(`${projectName}/${functionName}`)).toThrow();
    }, 100000);
  });
});

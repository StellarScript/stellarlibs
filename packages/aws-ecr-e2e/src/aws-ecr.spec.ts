import * as path from 'path';
import {
  uniq,
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
} from '@nx/plugin/testing';
import { ensureNxLocalLibs, cleanLocalLibs } from '@aws-nx/utils';
import { joinPathFragments } from '@nx/devkit';

describe('aws-ecr', () => {
  beforeAll(() => {
    ensureNxLocalLibs();
    ensureNxProject('@aws-nx/aws-ecr', 'dist/packages/aws-ecr');
  });

  afterAll(() => {
    cleanLocalLibs();
  });

  describe('Configure generator', () => {
    it('configure none-existing application (failure)', async () => {
      const appName = uniq('aws-ecr');
      expect(
        async () =>
          await runNxCommandAsync(
            `generate @aws-nx/aws-ecr:configure ${appName}`
          )
      );
    });

    it('configure application (success)', async () => {
      const appName = uniq('aws-ecr');
      await runNxCommandAsync(`generate @nx/js:lib ${appName}`);
      await runNxCommandAsync(`generate @aws-nx/aws-ecr:configure ${appName}`);
      expect(() => {
        checkFilesExist(path.join(appName));
        checkFilesExist(path.join(joinPathFragments(appName, 'Dockerfile')));
      });
    }, 100000);
  });
});

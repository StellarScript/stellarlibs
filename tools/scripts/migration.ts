import * as fs from 'fs';
import * as path from 'path';

const [, , packageName, scope, version] = process.argv;

const migrationJsonPath = path.resolve(
  `packages/${packageName}/migrations.json`
);

const packageJson = {
  packageJsonUpdates: {
    [version]: {
      version: version,
      packages: {
        [`${scope}/${packageName}`]: {
          alwaysAddToPackageJson: true,
          version: version,
        },
      },
    },
  },
};

fs.writeFileSync(migrationJsonPath, JSON.stringify(packageJson), {
  encoding: 'utf8',
  flag: 'w',
});

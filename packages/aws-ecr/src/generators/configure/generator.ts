import {
  type Tree,
  ProjectType,
  formatFiles,
  joinPathFragments,
  readProjectConfiguration,
} from '@nx/devkit';
import { addProjectFiles, toArray, updateConfiguration } from '@aws-nx/utils';
import { ConfigureGeneratorSchema } from './schema';

interface NormalizedOptions {
  projectRoot: string;
  projectType: ProjectType;
  projectName: string;
  tags: string[];
}

export async function configureGenerator(
  tree: Tree,
  schema: ConfigureGeneratorSchema
): Promise<void> {
  const options = normalizeOptions(tree, schema);
  configureProject(tree, options);

  const filePath = joinPathFragments(__dirname, 'files/src');
  addProjectFiles(tree, filePath, options);
  await formatFiles(tree);
}

function configureProject(tree: Tree, options: NormalizedOptions) {
  const configuration = {
    'ecr-auth': {
      executor: '@aws-nx/aws-ecr:auth',
      options: {},
    },
    'ecr-tag': {
      dependsOn: ['ecr-auth', 'build'],
      executor: '@aws-nx/aws-ecr:tag',
      options: {},
    },
    'ecr-push': {
      dependsOn: ['ecer-tag'],
      executor: '@aws-nx/aws-ecr:push',
      options: {},
    },
    'ecr-build': {
      dependsOn: ['build'],
      executor: '@aws-nx/aws-ecr:build',
      options: {
        injectEnvs: ['NODE_ENV'],
      },
    },
  };
  updateConfiguration(tree, options.projectName, (workspace) => {
    workspace.tags = [...(workspace?.tags || []), ...(options?.tags || [])];
    workspace.targets = {
      ...workspace?.targets,
      ...configuration,
    };
    return workspace;
  });
}

function normalizeOptions(
  tree: Tree,
  schema: ConfigureGeneratorSchema
): NormalizedOptions {
  const projectConfig = readProjectConfiguration(tree, schema.name);
  const projectType = projectConfig.projectType as ProjectType;
  const projectRoot = projectConfig.root;

  return {
    projectRoot,
    projectType,
    projectName: schema.name,
    tags: toArray(schema.tag),
  };
}
export default configureGenerator;

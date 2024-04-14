// import * as path from 'path';
import { generateFiles, joinPathFragments, offsetFromRoot, Tree } from '@nx/devkit';
import { getProjectDir, ProjectType } from '@stellarlibs/utils';
import { AppGeneratorSchema } from './schema';

interface NormalizedSchema {
   projectRoot: string;
   projectSource: string;
   workspaceRoot: string;
   projectName: string;
   serviceName: string;
}

export default async function appGenerator(tree: Tree, schema: AppGeneratorSchema) {
   const options = normalizeOptions(tree, schema);
}

/**
 *
 * @param tree
 * @param schema
 * @returns
 */
function normalizeOptions(tree: Tree, schema: AppGeneratorSchema): NormalizedSchema {
   const projDir = getProjectDir(tree, ProjectType.Application);
   const workspaceDir = joinPathFragments(projDir, schema.project);

   const workspaceRoot = '.';
   const projectRoot = joinPathFragments(workspaceDir, schema.name);
   const projectSource = joinPathFragments(projectRoot, 'src');

   return {
      projectRoot,
      projectSource,
      workspaceRoot,
      projectName: schema.name,
      serviceName: schema.project,
   };
}

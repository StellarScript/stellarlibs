export interface DeployExecutorSchema {
  all?: boolean;
  app?: string;
  force?: boolean;
  progress?: string;
  outputFile?: string;
  noRollback?: boolean;
  tag?: string | string[];
  stack?: string | string[];
  parameter?: string | string[];
  method?: string;
  changeSetName?: string;
  ignoreNoStacks?: boolean;
  hotswap?: string;
  hotswapFallback?: string;
}

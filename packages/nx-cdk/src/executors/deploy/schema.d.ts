import { CommonExecutorSchema, CommonStackExecutorSchema } from '../../common/executor';

export interface DeployExecutorSchema extends CommonExecutorSchema, CommonStackExecutorSchema {
   app?: string;
   force?: boolean;
   progress?: string;
   outputFile?: string;
   noRollback?: boolean;
   method?: string;
   changeSetName?: string;
   ignoreNoStacks?: boolean;
   hotswap?: string;
   hotswapFallback?: string;
}

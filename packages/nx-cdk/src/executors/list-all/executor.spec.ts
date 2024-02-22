import { ListAllExecutorSchema } from './schema';
import executor from './executor';

const options: ListAllExecutorSchema = {};

describe('ListAll Executor', () => {
   it('can run', async () => {
      const output = await executor(options);
      expect(output.success).toBe(true);
   });
});

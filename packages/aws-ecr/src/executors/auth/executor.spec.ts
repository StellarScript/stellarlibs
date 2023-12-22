import { AuthExecutorSchema } from './schema';
import executor from './executor';

const options: AuthExecutorSchema = {};

describe('Auth Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});

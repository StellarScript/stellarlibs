import { PushExecutorSchema } from './schema';
import executor from './executor';

const options: PushExecutorSchema = {};

describe('Push Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});

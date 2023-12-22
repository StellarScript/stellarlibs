import { execSync } from 'child_process';

export class AwsCli {
  public static verifyCli(): void {
    const ErrorMessage = () => {
      return new Error('aws cli is not installed');
    };

    try {
      const res = execSync('aws --version');

      if (!(res.toString().trim().length > 0)) {
        throw ErrorMessage();
      }
    } catch (error) {
      throw ErrorMessage();
    }
  }
}

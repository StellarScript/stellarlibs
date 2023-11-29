<br>

# Nx Aws Cdk Documentation

AWS Cloud Development Kit (CDK) applications within Nx workspaces.

<br>

## Table of Contents

1. [Generate Application](#generate-application)
2. [Remove Application](#remove-application)
3. [Environment Bootstrap](#bootstrap)
4. [Synthesize Application](#synth)
5. [Deploy Application/Stack](#deploy)
6. [Destroy Application/Stack](#destroy)

---

<br>

## Installation

The [`@aws-nx/aws-cdk`](https://www.npmjs.com/package/@aws-nx/aws-cdk) package can be installed via npm or yarn. It provides tools for managing AWS CDK applications. To install, use the following command:

```bash
npm i @aws-nx/aws-cdk
```

<br>
<br>

## 1. Generate Application<a name="generate-application"></a>

To generate a new application, use the following command. This command sets up a new AWS CDK application with optional configurations for testing and linting.

```bash
nx g @aws-nx/aws-cdk:application <APP_NAME>
    [--jest <Boolean>]
    [--linting <Boolean>]
    [--tag <String>]
    [--directory <String>]
```

#### Options:

- `--jest` (optional): Includes Jest for testing the application if set to true.
- `--linting` (optional): Enables linting for the application if set to true.
- `--tag` (optional): Tags to categorize your applications. You can pass multiple --tag arguments.
- `--directory` (optional): Specifies the directory where the application will be created.

#### Example:

```bash
nx g @aws-nx/aws-cdk:application myapp --tag experimental --tag infrastructure --directory apps
```

<br>
<br>

## 2. Remove Application<a name="remove-application"></a>

To remove an existing application, use the following command:

```bash
nx g @aws-nx/aws-cdk:remove <APP_NAME>
```

<br>
<br>

## 3. Bootstrap<a name="bootstrap"></a>

Before deploying the application, it's necessary to bootstrap the environment. This step prepares the AWS resources required for deployment.

```bash
nx bootstrap <APP_NAME>
    [--profile <AWS_Profile>]
    [--qualifier <Bootstrap_Qualifier>]
    [--bucketName <Bucket_Name>]
    [--executionPolicy <Execution_Policy_ARN>]
    [--terminationProtection]
    [--kmsKeyId <Kms_Key_Id>]
    [--trust <Trust_Options>]
```

#### Options:

- `--profile` (optional): Specifies the AWS profile for bootstrapping.
- `--qualifier` (optional): Specifies the bootstrap qualifier.
- `--bucketName` (optional): Specifies the bootstrap bucket name.
- `--executionPolicy` (optional): Specifies the execution policy ARN.
- `--terminationProtection` (optional): Protects against termination.
- `--kmsKeyId` (optional): Specifies the KMS key ID.
- `--trust` (optional): Specifies trust options.

<br>
<br>

## 4. Synth<a name="synth"></a>

The `nx synth <APP_NAME>` command is used to synthesize the application, which means it compiles your source code into a format that can be deployed to AWS.

```bash
nx synth <APP_NAME>
    [--output <OUTPUT_DIRECTORY>]
```

#### Options:

- `--output` (optional): Specifies the directory for the synthesized output.

<br>
<br>

## 5. Deploy<a name="deploy"></a>

To deploy the application/stack, execute:

```bash
nx deploy <Stack_Name>
    [--stack <Stack_Name>]
```

#### Options:

- `--stack` (optional) <Stack_Name>: Specifies the stack name to deploy. You can pass multiple --stack arguments.

#### Example:

```bash
nx deploy --stack StackOne --stack StackTwo
```

<br>
<br>

## 6. Destroy<a name="destroy"></a>

To destroy the application/stack, execute:

```bash
nx destroy <Stack_Name>
    [--stack <String>]
    [--all <Boolean>]
```

#### Options:

- --stack or --all argument needs to be passed.
  - `--stack` (optional): Specifies the stack name to destroy. You can pass multiple --stack arguments.
  - `--all` (optional): Pass --all to destory all stack.

#### Example:

```bash
nx destroy --stack StackOne --stack StackTwo
```

<br>
<br>

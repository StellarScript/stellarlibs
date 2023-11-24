<br>

# Nx Aws Cdk Documentation

<br>

## Table of Contents

1. [Create Application](#create-application)
2. [Remove Application](#remove-application)
3. [Bootstrap](#bootstrap)
4. [Synth](#synth)
5. [Deploy](#deploy)
6. [Destroy](#destroy)

---

<br>

## Installation

[npm library](https://www.npmjs.com/package/@aws-nx/aws-cdk)

```bash
npm i @aws-nx/aws-cdk
```

<br>

## 1. Create Application<a name="create-application"></a>

To create a new application, execute the following command:

```bash
nx g @aws-nx/aws-cdk:application <APP_NAME>
        [--jest <true or false>]
        [--linting <true or false>]
        [--tag <Tag_Name>]
        [--directory <Path_To_Directory>]
```

#### Options:

- `--tag` (optional): Specify tags, multiple tag argument can be passed.
- `--directory` (optional): Specify the directory path for the application.
- `--jest` (optional): Include Jest for testing.
- `--linting` (optional): Enable linting for the application.

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

Before deploying the application, bootstrap the environment:

```bash
nx bootstrap <APP_NAME>
```

#### Options:

- `--profile` (optional): Specify the AWS profile for bootstrapping.
- `--qualifier` (optional): Specify bootstrap qualifier
- `--bucketName` (optional): Bootsrap bucket name
- `--executionPolicy` (optional): Execution policy ARN
- `--terminationProtection`(optional): Protect agains termination
- `--kmsKeyId` (optional): Specify Kms key id
- `--trust` (optional): Tags
- `--trust` (optional): Trust

<br>
<br>

## 4. Synth<a name="synth"></a>

To synthesize the application, execute:

```bash
nx synth <App_Name>
    [--output <Output_Directory>]
```

#### Options:

- `--output` (optional) <Output_Directory>: Specify the directory for the synthesized output.

<br>

## 5. Deploy<a name="deploy"></a>

To deploy the application/stack, execute:

```bash
nx deploy <Stack_Name>
    [--stack <Stack_Name>]
```

#### Options:

- `--stack` (optional) <Stack_Name>: Specify the stack name to deploy.

<br>

## 6. Destroy<a name="destroy"></a>

To destroy the application/stack, execute:

```bash
nx destroy <Stack_Name>
    [--stack <Stack_Name>]
```

#### Options:

- `--stack` (optional) <Stack_Name>: Specify the stack name to destroy.

<br>

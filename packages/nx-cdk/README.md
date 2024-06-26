<br>

# Nx Aws Cdk Documentation

AWS Cloud Development Kit (CDK) applications within Nx workspaces.

<br>

## Table of Contents

1. [Generate Application](#generate-application)
2. [Generate Library](#generate-library)
3. [Remove Application](#remove-application)
4. [Environment Bootstrap](#bootstrap)
5. [Synthesize Application](#synth)
6. [Deploy Application/Stack](#deploy)
7. [Destroy Application/Stack](#destroy)

---

<br>

## Installation

The [`@stellarlibs/nx-cdk`](https://www.npmjs.com/package/@stellarlibs/nx-cdk) package can be installed via npm or yarn. It provides tools for managing AWS CDK applications. To install, use the following command:

```bash
npm i @stellarlibs/nx-cdk
```

</br>

## Starter

basic commands

```sh
nx g @stellarlibs/nx-cdk:app <AppName>
```

```sh
nx bootstrap <AppName>
```

```sh
nx deploy <AppName>
```

<br>
<br>

## 1. Generate Application<a name="generate-application"></a>

To generate a new application, use the following command. This command sets up a new AWS CDK application with optional configurations for testing and linting.

```sh
nx g @stellarlibs/nx-cdk:app <APP_NAME>

    [--tag <String>]
    [--directory <String>]
    [--testRunner <jest | none>]
```

#### Options:

-  `--tag` (optional): Tags to categorize your applications. You can pass multiple --tag arguments.
-  `--testRunner` (optional): Specifies the testing library to use. Jest | None.
-  `--directory` (optional): Specifies the directory where the application will be created.

#### Example:

```bash
nx g @stellarlibs/nx-cdk:app myapp --tag experimental --tag infrastructure --directory apps
```

<br>
<br>

## 2. Generate Library<a name="generate-library"></a>

To generate a new library, use the following command. This command sets up a new AWS CDK library with optional configurations for testing and linting.

```sh
nx g @stellarlibs/nx-cdk:lib <APP_NAME>

    [--tag <String>]
    [--directory <String>]
    [--testRunner <jest | none>]
```

#### Options:

-  `--tag` (optional): Tags to categorize your applications. You can pass multiple --tag arguments.
-  `--testRunner` (optional): Specifies the testing library to use. Jest | None.
-  `--directory` (optional): Specifies the directory where the application will be created.

#### Example:

```bash
nx g @stellarlibs/nx-cdk:lib myapp --tag experimental --tag infrastructure --directory apps
```

</br>
</br>

## 3. Remove Application<a name="remove-application"></a>

To remove an existing application, use the following command:

```bash
nx g @stellarlibs/nx-cdk:remove <APP_NAME>
```

<br>
<br>

## 4. Bootstrap<a name="bootstrap"></a>

Before deploying the application, it's necessary to bootstrap the environment. This step prepares the AWS resources required for deployment.

| **_Check aws cdk documentation for more options_**

```bash
nx bootstrap <APP_NAME>
    [--all <Boolean>]
    [--qualifier <Bootstrap_Qualifier>]
    [--bucketName <Bucket_Name>]
    [--executionPolicy <Execution_Policy_ARN>]
    [--terminationProtection]
    [--kmsKeyId <Kms_Key_Id>]
    [--trust <Trust_Options>]
    ...
```

#### Options:

-  `--profile` (optional): Specifies the AWS profile for bootstrapping.
-  `--qualifier` (optional): Specifies the bootstrap qualifier.
-  `--bucketName` (optional): Specifies the bootstrap bucket name.
-  `--executionPolicy` (optional): Specifies the execution policy ARN.
-  `--terminationProtection` (optional): Protects against termination.
-  `--kmsKeyId` (optional): Specifies the KMS key ID.
-  `--trust` (optional): Specifies trust options.

<br>
<br>

## 5. Synth<a name="synth"></a>

The `nx synth <APP_NAME>` command is used to synthesize the application, which means it compiles your source code into a format that can be deployed to AWS.

```bash
nx synth <APP_NAME>
    [--output <OUTPUT_DIRECTORY>]
```

#### Options:

-  `--output` (optional): Specifies the directory for the synthesized output.

<br>
<br>

## 6. Deploy<a name="deploy"></a>

To deploy the application/stack, execute:

```bash
nx deploy <Stack_Name>
    [--stack <Stack_Name>]
```

#### Options:

-  `--stack` (optional) <Stack_Name>: Specifies the stack name to deploy. You can pass multiple --stack arguments.

#### Example:

```bash
nx deploy --stack StackOne --stack StackTwo
```

<br>
<br>

## 7. Destroy<a name="destroy"></a>

To destroy the application/stack, execute:

```bash
nx destroy <Stack_Name>
    [--stack <Stack_Name>]
```

#### Options:

-  `--stack` (optional): Specifies the stack name to destroy. You can pass multiple --stack arguments.

#### Example:

```bash
nx destroy --stack StackOne --stack StackTwo
```

<br>
<br>

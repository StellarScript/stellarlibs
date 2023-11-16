# Aws-Cdk Documentation

## Table of Contents

1. [Create Application](#create-application)
2. [Remove Application](#remove-application)
3. [Bootstrap](#bootstrap)
4. [Synth](#synth)

---

<br>

## 1. Create Application<a name="create-application"></a>

To create a new application, execute the following command:

```bash
nx g @appify/aws-cdk:application <APP_NAME>
        [--jest <true or false>]
        [--linting <true or false>]
        [--tags <Tag_Name>]
        [--directory <Path_To_Directory>]
```

#### Options:

- `--tags` (optional): Specify tags for the application.
- `--directory` (optional): Specify the directory path for the application.
- `--jest` (optional): Include Jest for testing.
- `--linting` (optional): Enable linting for the application.

<br>
<br>

## 2. Remove Application<a name="remove-application"></a>

To remove an existing application, use the following command:

```bash
nx g @appify/aws-cdk:remove <APP_NAME>
```

<br>
<br>

## 3. Bootstrap<a name="bootstrap"></a>

Before deploying the application, bootstrap the environment:

```bash
nx bootstrap <APP_NAME>
    [--profile <Name accountId/region>]
```

#### Options:

- `--profile` (optional): Specify the AWS profile for bootstrapping.

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

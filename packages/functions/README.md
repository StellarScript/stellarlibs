<br>

# Functions Documentation

The @stellar-libs/functions is a tool within Nx workspaces to build, bundle, and package serverless functions.

<br>

## Table of Contents

1. [Generate App](#generate-application)
2. [Generate Library](#generate-library)
3. [Remove Application](#remove-application)
4. [Remove Function](#remove-function)
5. [Execute Build](#execute-build)

---

<br>

## Installation

The [`@stellar-libs/functions`](https://www.npmjs.com/package/@stellar-libs/functions) library can be installed via npm. It provides tools for generating, managing, and removing AWS CDK applications and functions within Nx workspaces. To install, use the following command:

```bash
npm i @stellar-libs/functions
```

<br>
<br>

## 1. Generate Application<a name="generate-application"></a>

To generate a new application, execute the following command:

```bash
nx g @stellar-libs/functions:app <Function_Name> --project <Project_Name>
```

#### Options:

- `--project` (required): Specify project name.
- `--bundle` (optional): Bundle project on build.
- `--tag` (optional): Specify tags for project

<br>
<br>

## 2. Generate Library<a name="generate-library"></a>

Generate through prompt:

```bash
nx g lib
```

To generate a new library, execute the following command:

```bash
nx g @stellar-libs/functions:lib <Function_Name> --project <Project_Name>
```

#### Options:

- `--project` (required): Specify project name.
- `--bundle` (optional): Bundle project on build.
- `--tag` (optional): Specify tags for project

<br>
<br>

## 3. Remove Application<a name="remove-application"></a>

To remove an application, use one of the following commands:

```bash
nx g @stellar-libs/functions:remove <APP_NAME>
```

or

```bash
nx g @stellar-libs/functions:remove --project <APP_NAME>
```

<br>
<br>

## 4. Remove Function<a name="remove-function"></a>

To remove a single function from an existing application, use one of the following commands:

```bash
nx g @stellar-libs/functions:remove <Project_Name> --function <Function_Name>
```

or

```bash
nx g @stellar-libs/functions:remove --function <Function_Name> --project <Project_Name>
```

<br>
<br>

<br>

# Functions Documentation

<br>

## Table of Contents

1. [Create App](#create-application)
2. [Remove Lib](#remove-application)
3. [Generate Function](#bootstrap)
4. [Build](#destroy)

---

<br>

## Installation

[npm library](https://www.npmjs.com/package/@aws-nx/functions)

```bash
npm i @aws-nx/functions
```

<br>

## 1. Create Application<a name="create-application"></a>

To create a new application, execute the following command:

```bash
nx g @aws-nx/functions:app <Function_Name> --project <Project_Name>
```

#### Options:

- `--project` (required): Specify project name.
- `--bundle` (optional): Bundle project on build.
- `--tag` (optional): Specify tags for project

<br>
<br>

## 2. Create Library<a name="create-library"></a>

To create a new library, execute the following command:

```bash
nx g @aws-nx/functions:lib <Function_Name> --project <Project_Name>
```

#### Options:

- `--project` (required): Specify project name.
- `--bundle` (optional): Bundle project on build.
- `--tag` (optional): Specify tags for project

<br>
<br>

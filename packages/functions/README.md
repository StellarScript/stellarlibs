<br>

# Functions Documentation

<br>

## Table of Contents

1. [Generate App](#create-application)
2. [Generate Lib](#remove-application)
3. [Generate Function](#bootstrap)
4. [Execute Build](#destroy)

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

## 3. Remove Application<a name="remove-application"></a>

To remove application, use the following command:

```bash
nx g @aws-nx/functions:remove <APP_NAME>
```

or

```bash
nx g @aws-nx/functions:remove --project <APP_NAME>
```

<br>
<br>

## 4. Remove Function<a name="remove-function"></a>

To remove single function from an existing application, use the following command:

```bash
nx g @aws-nx/functions:remove <Project_Name> --function <Function_Name>
```

or

```bash
nx g @aws-nx/functions:remove --function <Function_Name> --project <Project_Name>
```

<br>
<br>

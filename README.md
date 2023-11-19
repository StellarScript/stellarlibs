![CI](https://github.com/StellarScript/aws-nx/actions/workflows/ci.yml/badge.svg)

---

# AWS Nx Plugins

This repository contains a collection of Nx plugins designed to work with AWS.

<br>

## Available Plugins

1. [**aws-cdk**](https://github.com/StellarScript/aws-nx/tree/main/packages/aws-cdk#nx-aws-cdk-documentation) - This plugin provides support for AWS Cloud Development Kit (CDK).

<br>

## Workspace

The workspace is generated using the following command:

```bash
npx create-nx-workspace aws-nx --package-manager=yarn
```

<br>

## Packages

plugin packages are generated using the following command:

```bash
nx g @nx/plugin:plugin <Plugin_Name> --directory packages --publishable --buildable
```

plugin e2e tests are generated using the following command:

```bash
nx g @nx/plugin:e2e-project --pluginName <Plugin_Name> --npmPackageName <Npm_Package_Name> --pluginOutputPath dist/<Plugin_Name>
```

<br>

## Plugin Generator & Executor

plugin generators are generated using the following command:

```bash
nx generate @nx/plugin:generator <Generator_Name> --project <Plugin_Name>
```

plugin executors are generated using the following command:

```bash
nx generate @nx/plugin:executor <Executor_Name> --project <Plugin_Name>
```

publish plugin to npm registry using the following command:

```bash
nx run <Plugin_Name>:publish --ver=0.0.1 --tag=latest
```

[![CI](https://github.com/StellarScript/aws-nx/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/StellarScript/aws-nx/actions/workflows/ci.yml)

---

# AWS Nx Plugins

This repository contains a collection of Nx plugins designed to work with AWS.

<br>

## Available Plugins

1. [**aws-cdk**](https://github.com/StellarScript/aws-nx/tree/main/packages/aws-cdk) - This plugin provides support for AWS Cloud Development Kit (CDK).

<br>

## Workspace

The workspace for these plugins are generated using the following command:

```bash
npx create-nx-workspace aws-nx --package-manager=yarn
```

plugins generators are generated using the following command:

```bash
nx generate @nx/plugin:generator <Generator_Name> --project <Plugin_Name>
```

plugins executors are generated using the following command:

```bash
nx generate @nx/plugin:executor <Executor_Name> --project <Plugin_Name>
```

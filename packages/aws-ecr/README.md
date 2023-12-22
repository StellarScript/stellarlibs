# Nx Aws Ecr Documentation

aws-ecr is a tool to manage AWS Elastic Container Registry (ECR) in NX workspace.

## Table of Contents

1. [Configure App](#configure-application)
2. [Authenticate](#auth-ecr)
3. [Build Container](#build-container)
4. [Tag Image](#tag-image)

---

<br>

## Installation

The [`@aws-nx/aws-ecr`](https://www.npmjs.com/package/@aws-nx/aws-ecr) package can be installed via npm or yarn. It provides tools for managing AWS ECR containers. To install, use the following command:

```bash
npm i @aws-nx/aws-ecr
```

<br>
<br>

## 1. Configure Application<a name="configure-application"></a>

To configure an application, use the following command. This command will generate dockerfile and project targets to manage containers.

```bash
nx g @aws-nx/aws-ecr:configure <APP_NAME>
    [--tag <String | String[]>]
```

<br>

## 2. Auth Ecr<a name="auth-ecr"></a>

To authenticate aws ecr, use the following command:

```bash
nx auth <App_Name>
```

<br>

## 3. Build Container<a name="build-container"></a>

To build docker container, use the following command:

```bash
nx docker-build <APP_NAME>
```

<br>

## 3. Tag Container Image<a name="tag-image"></a>

To tag docker image, use the following command:

```bash
nx tag <APP_NAME> --tag <Tag>
    [--tag <String | String[]>]
```

<br>

## 4. Push Container to ECR<a name="push-container"></a>

To push docker container to ecr, use the following command:

```bash
nx push <APP_NAME> --tag <Tag>
    [--tag <String | String[]>]
```

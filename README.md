# FileVault
![Landing page](./public/Landing%20Page.png)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TanStack Router](https://img.shields.io/badge/TanStack_Router-FF6B35?style=for-the-badge&logo=reactrouter&logoColor=white)
![React Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-844FBA?style=for-the-badge&logo=terraform&logoColor=white)
![LocalStack](https://img.shields.io/badge/LocalStack-4E2A84?style=for-the-badge&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)

FileVault is a full-stack AWS practice project for uploading, organizing, and browsing photos with authenticated folders, direct-to-S3 uploads, and Lambda-generated thumbnails. It uses a modern React frontend, a NestJS API, PostgreSQL for metadata, and LocalStack plus Terraform for local AWS-style infrastructure.

## What it does
- Authenticates users with Clerk
- Creates user-owned folders and photo records
- Uploads originals directly from the browser to S3 with pre-signed URLs
- Stores photo metadata in PostgreSQL through NestJS and TypeORM
- Triggers Lambda on `s3:ObjectCreated:*` to generate `200x200` WebP thumbnails
- Serves signed download URLs for both original files and thumbnails
- Provides a cleaner landing page that explains the AWS pipeline visually

## Upload flow

![Upload flow](./public/diagram/Presigned%20URL%20File%20Upload.png)

## Get flow

![Get flow](./public/diagram/Presigned%20URL%20Get%20Files.png)

## Stack

### Frontend

- React 19
- Vite 8
- TanStack Router
- TanStack React Query
- Clerk React
- Tailwind CSS 4
- Biome
- Axios

### Backend

- NestJS 11
- TypeScript
- TypeORM
- PostgreSQL
- Clerk backend SDK
- AWS SDK v3 for S3
- Swagger / Scalar docs at `/docs`

### AWS and local infrastructure

- S3 originals bucket
- S3 thumbnail bucket
- Lambda image resizer with `sharp`
- IAM role and bucket notification wiring
- Terraform for infrastructure definition
- LocalStack for local AWS emulation

## Repository structure

```text
backend/         NestJS API, auth, ownership guards, photo and folder logic
frontend/        React app, landing page, dashboard, Clerk integration
infrastructure/  Terraform for S3, Lambda, IAM, and bucket notifications
lambda/          Lambda source for automating simple task on the background like resizing
```

## How the system works

### 1. Authentication and ownership

Clerk handles sign-in on the frontend and token verification on the backend. Once authenticated, users can only access folders and photos that belong to them through the ownership guards in the API.

### 2. Direct browser upload to S3

The frontend does not stream the file through NestJS. Instead:

1. The frontend asks the backend for a pre-signed upload URL.
2. The backend generates that URL with the configured S3 bucket and object key.
3. The frontend uploads the file directly to S3 using `PUT`.
4. The frontend then calls the backend again to create the metadata record.

This keeps the API lighter and makes the upload path feel closer to a production AWS setup.

### 3. Lambda thumbnail generation

When the original image lands in the main bucket, S3 triggers the `image_resizer` Lambda. That Lambda reads the original object, resizes it with `sharp`, converts it to WebP, and writes the thumbnail into the thumbnail bucket.

Current thumbnail behavior:

- Size: `200x200`
- Format: `webp`
- Quality: `75`
- Output naming: original key plus `_200x200.webp`

### 4. Metadata and signed read access

Photo and folder metadata lives in PostgreSQL. When the frontend loads a folder, the backend returns metadata plus signed download URLs for both the original file and the thumbnail so the UI can display previews safely without making the buckets public.

## Local development setup

### Prerequisites

- Node.js 20+ recommended
- npm
- PostgreSQL running locally
- Docker for LocalStack
- AWS CLI installed locally
- Terraform installed locally
- Clerk project with publishable key, secret key, and webhook secret

### Environment variables

Create a `backend/.env` file:

```env
PORT=4000
SOFTWARE_ENV=development
FRONTEND_URL=http://localhost:3000

CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

AWS_REGION=ap-southeast-1
AWS_ENDPOINT=http://localhost.localstack.cloud:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_S3_BUCKET=file-uploader-bucket
AWS_S3_THUMBNAIL_BUCKET=thumbnail-uploader-bucket

DATABASE_URL=postgresql://postgres:password@localhost:5432/file_uploader
```

Create a `frontend/.env` file:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Start PostgreSQL

Run PostgreSQL locally and make sure the database in `DATABASE_URL` exists before starting the backend.

### Start LocalStack

```bash
docker run --rm -it -p 4566:4566 localstack/localstack
```

### Build and package the Lambda

```bash
cd lambda/resizer
npm install
npm run build
npm run package
```

This produces `lambda/lambda_function.zip`, which Terraform expects.

### Provision local AWS resources with Terraform

```bash
cd infrastructure
terraform init
terraform apply
```

This creates:

- `file-uploader-bucket`
- `thumbnail-uploader-bucket`
- Lambda execution role and policy
- `image_resizer` Lambda
- S3 bucket notification from originals bucket to Lambda

### Start the backend

```bash
cd backend
npm install
npm run start:dev
```

Backend defaults:

- API: `http://localhost:4000`
- API docs: `http://localhost:4000/docs`

### Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default:

- App: `http://localhost:3000`

## Suggested startup order

1. Start PostgreSQL
2. Start LocalStack
3. Build and package the Lambda
4. Run `terraform apply` in `infrastructure/`
5. Start the backend
6. Start the frontend

## Useful development commands

### Frontend

```bash
npm run dev
npm run build
npm run test
npm run check
```

### Backend

```bash
npm run start:dev
npm run build
npm run test
npm run test:e2e
```

### Lambda

```bash
npm run build
npm run package
```

## Current implementation notes

- The API exposes docs through Scalar at `/docs`.
- The frontend landing page now explains the same AWS flow that the system actually uses.
- Thumbnail metadata is currently created optimistically after upload; the backend assumes Lambda succeeds and derives the thumbnail key from the original key.
- TypeORM synchronization is enabled automatically outside production through `SOFTWARE_ENV`.

## Possible improvements

### Product and search improvements

- AI auto-labeling for photos so uploaded images can be tagged by content
- Semantic image search to find visually related photos
- Text search across generated labels, file names, and folders

### Platform improvements

- Multipart upload support for larger files
- Background retries or reconciliation if Lambda thumbnail generation fails
- Better upload progress, status, and thumbnail-processing states in the UI
- Real AWS deployment path with separate environments
- Object lifecycle policies and cleanup automation
- Better validation around file types, dimensions, and limits

## Why this project is useful

This repo is a practical bridge between a normal CRUD app and an AWS event-driven workflow. It covers authenticated frontend work, ownership-aware APIs, direct cloud storage uploads, event-triggered processing, and infrastructure-as-code in one project.
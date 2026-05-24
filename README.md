# File Uploader

A full-stack AWS learning project built with a local AWS emulation stack, featuring:
- NestJS backend with AWS SDK v3 for S3 file storage
- React frontend with TanStack Router, React Query, and Clerk authentication
- LocalStack-compatible S3 setup for local AWS learning and experimentation
- PostgreSQL for metadata persistence

## What this stack uses

### Backend
- NestJS 11
- TypeScript
- TypeORM
- PostgreSQL
- Clerk backend auth (`@clerk/backend`)
- Ngrok
- AWS SDK v3 (`@aws-sdk/client-s3`)
- LocalStack-compatible S3 endpoint
- Multer file uploads handled by NestJS

### Frontend
- React 19
- Vite
- TanStack Router
- TanStack React Query
- Clerk React auth (`@clerk/clerk-react`)
- Tailwind CSS 4
- Biome linting & formatting
- Axios for backend API calls

### Learning goals
- Build an authenticated file upload dashboard
- Use Clerk auth for secure routes and user session management
- Upload files to S3 using a local AWS emulator (`LocalStack`)
- Store upload metadata in PostgreSQL
- Practice integrating AWS-style file storage with a modern frontend

## Architecture overview

The project is organized as a monorepo with two main apps:
- `backend/` — NestJS API, authentication, folder/photo management, S3 upload service
- `frontend/` — React UI, authenticated dashboard, folder/file workflows

### Data flow
1. User signs in with Clerk on the frontend.
2. The frontend calls backend APIs with a Clerk bearer token.
3. NestJS verifies the token using `@clerk/backend`.
4. Authenticated users can create folders and upload photos.
5. Uploaded files are sent to S3 via the backend `S3Service`.
6. Photo metadata is stored in PostgreSQL and returned to the frontend.

## Local setup

### Prerequisites
- Node.js
- npm
- PostgreSQL running locally
- LocalStack running locally on `http://localhost:4566`
- Clerk account for auth keys

### Environment variables
Update `backend/.env` with values for your local environment. Example values:

```env
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
AWS_REGION=us-southest-1
AWS_S3_BUCKET=file-uploader-bucket
AWS_ENDPOINT=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
DATABASE_URL=postgresql://postgres:password@localhost:5432/File-Uploader?schema=public
FRONTEND_URL=http://localhost:3000
```

### Start LocalStack

This project is configured for LocalStack via `AWS_ENDPOINT=http://localhost:4566` and `forcePathStyle: true` in the backend S3 client.

Make sure LocalStack is running and the configured bucket exists:

```bash
docker run --rm -it -p 4566:4566 localstack/localstack
```

Then create the bucket if needed:

```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://file-uploader-bucket
```

## AWS S3 bucket configuration

If you are using a real AWS S3 bucket (instead of LocalStack), these settings match the current implementation (private bucket + presigned access).

### Block Public Access

Enable all options:
- Block public ACLs
- Ignore public ACLs
- Block public bucket policies
- Restrict public access

This results in no public access to the bucket.

### Object Ownership

- Bucket owner enforced

This disables ACLs and simplifies access control.

### CORS configuration

```json
{
	"CORSRules": [
		{
			"AllowedHeaders": ["*"],
			"AllowedMethods": ["GET", "PUT"],
			"AllowedOrigins": ["*"],
			"ExposeHeaders": []
		}
	]
}
```

### Backend install and run

```bash
cd file-uploader/backend
npm install
npm run start:dev
```

### Frontend install and run

```bash
cd file-uploader/frontend
npm install
npm run dev
```

## Backend details

### S3 integration
The backend S3 service uses:
- `S3Client` from `@aws-sdk/client-s3`
- `PutObjectCommand` for server-side uploads (when used)
- `DeleteObjectCommand` for cleanup
- Presigned URLs via `getSignedUrl` from `@aws-sdk/s3-request-presigner`
- `forcePathStyle: true` to support LocalStack URL style

The upload flow is implemented in `backend/src/file-upload/s3.service.ts`.

### Authentication
- `backend/src/common/guard/auth.guard.ts` verifies Clerk bearer tokens
- Protected upload and folder routes require valid auth
- Folder ownership and photo ownership guards protect user data
- Backend syncs Clerk user state into the local database via webhook handling, so our app can enforce ownership and user-specific folder/photo access

### Clerk webhook sync
- `backend/src/auth/auth.service.ts` validates Clerk webhook signatures using `CLERK_WEBHOOK_SECRET`
- User create/update/delete events are synchronized to the local `User` entity
- This keeps local folder and photo ownership aligned with Clerk identity state

### File metadata
Photo metadata is stored in PostgreSQL via TypeORM entities:
- `Photo` entity with `s3Bucket`, `s3Key`, `fileName`, `fileSize`, `fileType`
- `Folder` entity and relations to users

## Frontend details

### Main capabilities
- Create and list folders
- Upload photos into selected folders
- View uploaded photos per folder
- Delete photos
- Full auth flow with Clerk

### API hooks
The frontend uses Axios and custom hooks under `frontend/src/hook/`:
- `useCreateFolderMutation`
- `useGetFoldersQuery`
- `useGetPhotosQuery`
- `useUploadPhotoMutation`
- `useDeletePhoto`

### UI
- Uses existing Tailwind + shadcn-style components
- Routed views are built with TanStack Router in `frontend/src/routes`

## What was learned here
- How to wire a modern React frontend to a NestJS backend
- How to use Clerk for authentication and session handling
- How to upload binary files to S3 from NestJS
- How to use a local AWS emulator (LocalStack) for safe AWS practice
- How to connect auth-protected operations to database-backed ownership rules

## Possible improvements

- Add multipart uploads for large files
- Add S3 lifecycle rules for expiration/cleanup
- Add stronger server-side validation (file type/size) and upload retry/progress UX

## Notes
- This README covers the local development stack only.
- The backend currently uses the local S3 endpoint and local Postgres by default.
- The app is wired for AWS-style development and is a good starting point for moving to real AWS once tested locally.

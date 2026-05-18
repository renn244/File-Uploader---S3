import { ApiResponseProperty } from "@nestjs/swagger";

export class PhotoResponse {
    @ApiResponseProperty({ type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' })
    id!: string;

    @ApiResponseProperty({ type: 'string', example: 'personal_photo' })
    fileName!: string;

    @ApiResponseProperty({ type: 'string', example: 'personal_photo' })
    originalName!: string;

    @ApiResponseProperty({ type: 'number', example: 3000000 })
    fileSize!: number;

    @ApiResponseProperty({ type: 'string', example: 'jpg' })
    fileType!: string;

    @ApiResponseProperty({ type: 'string', example: 'file-uploader' })
    s3Bucket!: string;

    @ApiResponseProperty({ type: 'string', example: '/folder/photos/personal_photo.jpg' })
    s3Key!: string;

    @ApiResponseProperty({ type: 'string', format: 'date-time', example: '2026-05-18T18:08:00+08:00' })
    uploadedAt!: Date;

    @ApiResponseProperty({ type: 'string', format: 'date-time', example: '2026-05-18T18:08:00+08:00' })
    updatedAt!: Date;
}

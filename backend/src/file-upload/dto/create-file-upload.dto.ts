import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFileUploadDto {
    @IsNotEmpty()
    @IsNumber()
    fileSize!: number;

    @IsNotEmpty()
    @IsString()
    originalName!: string;

    @IsNotEmpty()
    @IsString()
    fileType!: string;

    @IsNotEmpty()
    @IsString()
    s3Bucket!: string;

    @IsNotEmpty()
    @IsString()
    s3Key!: string;
}
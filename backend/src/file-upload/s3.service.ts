import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";

@Injectable()
export class S3Service {
    private readonly s3!: S3Client;
    private readonly bucketName!: string;

    constructor(private readonly configService: ConfigService) {
        this.bucketName = this.configService.get("AWS_S3_BUCKET")!;
        
        this.s3 = new S3Client({
            region: this.configService.get<string>("AWS_REGION") || "ap-southeast-1",
            endpoint: this.configService.get<string>("AWS_ENDPOINT")!, // LocalStack
            forcePathStyle: true, // important for LocalStack
            credentials: {
                accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID")!,
                secretAccessKey: this.configService.get<string>("AWS_SECRET_ACCESS_KEY")!,
            }
        })
    }

    async uploadFile(file: Express.Multer.File, folderId: string) {
        const fileExtension = file.originalname.split('.').pop();

        const s3Key = `folders/${folderId}/${randomUUID()}.${fileExtension}`
    
        await this.s3.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: s3Key,
                Body: file.buffer,
                ContentType: file.mimetype
            })
        )

        return { bucket: this.bucketName, key: s3Key }
    }

    async deleteFile(key: string, bucket: string = this.bucketName) {
        await this.s3.send(
            new DeleteObjectCommand({
                Bucket: bucket,
                Key: key
            })
        )

        return { bucket, key };
    }
}
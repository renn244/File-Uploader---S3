import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FolderService } from 'src/folder/folder.service';
import { Repository } from 'typeorm';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';
import { Photo } from './photo.entity';
import { S3Service } from './s3.service';


@Injectable()
export class FileUploadService {
    constructor(
        @Inject('PHOTO_REPOSITORY') private readonly photoRepository: Repository<Photo>,
        private readonly folderService: FolderService,
        private readonly s3Service: S3Service,
        private readonly configService: ConfigService
    ) {}

    async createPhoto(body: CreateFileUploadDto, folderId: string) {
        const { originalName, fileSize, fileType, s3Bucket, s3Key } = body;
        const folder = await this.folderService.getFolderById(folderId);
    
        
        if(!folder) {
            throw new NotFoundException('folder does not exist!')
        }
        
        // we are assuming the lambda successfully created the thumbnail version
        // but this is not sync with the lambda TODO LATER: make lambda update the db (our db is local not rds yet) 
        const thumbnailBucket = this.configService.get<string>("AWS_S3_THUMBNAIL_BUCKET");
        const thumbnailKey = `${this.getFileName(s3Key)}_200x200.webp`
        console.log(thumbnailKey)
        const newPhoto = this.photoRepository.create({
            fileName: s3Key.split('/').pop(),
            folder: { id: folderId },
            originalName: originalName,
            fileSize: fileSize,
            fileType: fileType,
            s3Bucket: s3Bucket,
            s3Key: s3Key,
            thumbnailS3Bucket: thumbnailBucket,
            thumbnailS3Key: thumbnailKey
        })
        await this.photoRepository.save(newPhoto);

        return newPhoto
    }

    private getFileName(s3Key: string): string {
        const lastDot = s3Key.lastIndexOf(".");

        if (lastDot === -1) {
            return s3Key;
        }

        return s3Key.substring(0, lastDot);
    }

    // make sure we have query dto to validate the content type and file name
    async getUploadUrl(contentType: string, fileName: string, folderId: string) {
        return this.s3Service.getUploadUrl(contentType, fileName, folderId);
    }

    async getPhotos(folderId: string) {
        const folder = await this.folderService.getFolderById(folderId);
        const photos = await this.photoRepository.find({
            where: { folder: { id: folderId } }
        })

        const photoWithDownloadUrl = await Promise.all(
            photos.map(async (photo) => {
                const downloadUrl = await this.s3Service.getDownloadUrl(photo.s3Key, photo.s3Bucket);
                const thumbnailUrl = photo.thumbnailS3Key ? 
                    await this.s3Service.getDownloadUrl(photo.thumbnailS3Key, photo.thumbnailS3Bucket)
                    : null

                return {
                    ...photo,
                    downloadUrl,
                    thumbnailUrl
                }
            })
        )

        return {
            ...folder,
            photos: photoWithDownloadUrl || []
        }
    }

    async getPhotoWithFolderAndUserId(photoId: string) {
        const photo = await this.photoRepository.findOne({
            where: { id: photoId },
            relations: {
                folder: {
                    user: true
                }
            }
        });

        return photo
    }

    async deletePhoto(photoId: string)  {
        const photo = await this.photoRepository.findOneBy(
            {  id: photoId }
        )

        if(!photo) {
            throw new NotFoundException('photo does not exist!')
        }

        await this.s3Service.deleteFile(photo.s3Key, photo.s3Bucket);
        await this.photoRepository.delete({ id: photoId });

        return {
            message: 'photo successfully deleted!'
        }
    }
}

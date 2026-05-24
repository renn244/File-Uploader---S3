import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FolderService } from 'src/folder/folder.service';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
import { S3Service } from './s3.service';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';

@Injectable()
export class FileUploadService {
    constructor(
        @Inject('PHOTO_REPOSITORY') private readonly photoRepository: Repository<Photo>,
        private readonly folderService: FolderService,
        private readonly s3Service: S3Service
    ) {}

    async createPhoto(body: CreateFileUploadDto, folderId: string) {
        const { originalName, fileSize, fileType, s3Bucket, s3Key } = body;
        const folder = await this.folderService.getFolderById(folderId);
    
        if(!folder) {
            throw new NotFoundException('folder does not exist!')
        }
        
        const newPhoto = this.photoRepository.create({
            fileName: s3Key.split('/').pop(),
            folder: { id: folderId },
            originalName: originalName,
            fileSize: fileSize,
            fileType: fileType,
            s3Bucket: s3Bucket,
            s3Key: s3Key,
        })
        await this.photoRepository.save(newPhoto);

        return newPhoto
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
                return {
                    ...photo,
                    downloadUrl
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

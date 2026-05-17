import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FolderService } from 'src/folder/folder.service';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
import { S3Service } from './s3.service';

@Injectable()
export class FileUploadService {
    constructor(
        @Inject('PHOTO_REPOSITORY') private readonly photoRepository: Repository<Photo>,
        private readonly folderService: FolderService,
        private readonly s3Service: S3Service
    ) {}

    async createPhoto(file: Express.Multer.File, folderId: string) {
        const { originalname, size, mimetype } = file;
        const folder = await this.folderService.getFolderById(folderId);
    
        if(!folder) {
            throw new NotFoundException('folder does not exist!')
        }

        const result = await this.s3Service.uploadFile(file, folderId);
        
        try {
            const newPhoto = this.photoRepository.create({
                fileName: result.key.split('/').pop(),
                folder: { id: folderId },
                originalName: originalname,
                fileSize: size,
                fileType: mimetype,
                s3Bucket: result.bucket,
                s3Key: result.key,
            })
            await this.photoRepository.save(newPhoto);

            return newPhoto
        } catch(error) {
            // to not have an orphan file in s3 bucket
            await this.s3Service.deleteFile(result.key, result.bucket);
            throw error;
        }
    }

    async getPhotos(folderId: string) {
        const folder = await this.folderService.getFolderById(folderId);
        const photos = await this.photoRepository.find({
            where: { folder: { id: folderId } }
        })

        return {
            ...folder,
            photos: photos || []
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

import { Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { ClerkAuthGuard } from 'src/common/guard/auth.guard';
import { FolderOwnershipGuard } from 'src/folder/guard/folderOwnership.guard';
import { FileUploadService } from './file-upload.service';
import { PhotoOwnershipGuard } from './guard/PhotoOwneship.guard';
import { GetPhotosResponse } from './response/getPhotos.response';
import { PhotoResponse } from './response/photo.response';

@Controller('file-upload')
@UseGuards(ClerkAuthGuard)
export class FileUploadController {
    constructor(
        private readonly fileUploadService: FileUploadService,
    ) {}

    @Post(':folderId')
    @ApiCreatedResponse({ type: PhotoResponse })
    @UseGuards(FolderOwnershipGuard)
    @UseInterceptors(FileInterceptor('photo'))
    async uploadPhoto(@UploadedFile() file: Express.Multer.File, @Param('folderId') folderId: string) {
        return this.fileUploadService.createPhoto(file, folderId);
    }

    @UseGuards(FolderOwnershipGuard)
    @ApiOkResponse({ type: GetPhotosResponse })
    @Get(':folderId')
    async getPhotos(@Param('folderId') folderId: string) {
        return this.fileUploadService.getPhotos(folderId);
    }

    @UseGuards(PhotoOwnershipGuard)
    @ApiNoContentResponse({  description: 'Photo deleted successfully' })
    @Delete(':photoId')
    async deletePhoto(@Param('photoId') photoId: string) {
        return this.fileUploadService.deletePhoto(photoId);
    }
}

import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { ClerkAuthGuard } from 'src/common/guard/auth.guard';
import { FolderOwnershipGuard } from 'src/folder/guard/folderOwnership.guard';
import { FileUploadService } from './file-upload.service';
import { PhotoOwnershipGuard } from './guard/PhotoOwneship.guard';
import { GetPhotosResponse } from './response/getPhotos.response';
import { PhotoResponse } from './response/photo.response';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';

@Controller('file-upload')
@UseGuards(ClerkAuthGuard)
export class FileUploadController {
    constructor(
        private readonly fileUploadService: FileUploadService,
    ) {}

    @Post(':folderId')
    @ApiCreatedResponse({ type: PhotoResponse })
    @UseGuards(FolderOwnershipGuard)
    async uploadPhoto(@Body() body: CreateFileUploadDto, @Param('folderId') folderId: string) {
        return this.fileUploadService.createPhoto(body, folderId);
    }

    @UseGuards(FolderOwnershipGuard)
    @ApiOkResponse({ description: 'Pre-signed URL generated successfully' })
    @Get('upload-url/:folderId')
    async getUploadUrl(@Param('folderId') folderId: string, @Query() query: { contentType: string, fileName: string }) {
        return this.fileUploadService.getUploadUrl(query.contentType, query.fileName, folderId);
    }

    @UseGuards(FolderOwnershipGuard)
    @ApiOkResponse({ type: GetPhotosResponse })
    @Get('folder/:folderId')
    async getPhotosByFolder(@Param('folderId') folderId: string) {
        return this.fileUploadService.getPhotos(folderId);
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

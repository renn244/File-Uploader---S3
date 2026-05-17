import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FolderService } from './folder.service';
import { ClerkAuthGuard } from 'src/common/guard/auth.guard';
import { User, UserSession } from 'src/common/decorators/userSession.decorator';
import { FolderOwnershipGuard } from './guard/folderOwnership.guard';

@Controller('folders')
@UseGuards(ClerkAuthGuard)
export class FolderController {
    constructor(
        private readonly folderService: FolderService,
    ) {}

    @Post()
    async createFolder(@Body() body: CreateFolderDto, @User() user: UserSession) {
        return this.folderService.createFolder(body, user);
    }

    @Get()
    async getFolders(@User() user: UserSession) {
        return this.folderService.getFolders(user);
    }

    @UseGuards(FolderOwnershipGuard)
    @Get(':folderId')
    async getFolderById(@Param('folderId') folderId: string) {
        return this.folderService.getFolderById(folderId);
    }

    @UseGuards(FolderOwnershipGuard)
    @Patch(':folderId')
    async updateFolderById(@Param('folderId') folderId: string, @Body() body: UpdateFolderDto) {
        return this.folderService.updateFolderById(folderId, body);
    }

    @UseGuards(FolderOwnershipGuard)
    @Delete(':folderId')
    async deleteFolderById(@Param('folderId') folderId: string) {
        return this.folderService.deleteFolderById(folderId);
    }
}

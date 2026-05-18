import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiNoContentResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { User, UserSession } from 'src/common/decorators/userSession.decorator';
import { ClerkAuthGuard } from 'src/common/guard/auth.guard';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FolderService } from './folder.service';
import { FolderOwnershipGuard } from './guard/folderOwnership.guard';
import { CreateFolderResponse } from './response/createFolder.response';
import { GetFolderResponse } from './response/getFolders.response';
import { FolderResponse } from './response/folder.response';
import { UpdateFolderResponse } from './response/updateFolder.response';

@Controller('folders')
@UseGuards(ClerkAuthGuard)
@ApiBearerAuth('Authorization')
@ApiUnauthorizedResponse()
@ApiHeader({ name: 'Authorization', description: "Put here you're clerk session" })
export class FolderController {
    constructor(
        private readonly folderService: FolderService,
    ) {}

    @ApiCreatedResponse({ type: CreateFolderResponse })
    @Post()
    async createFolder(@Body() body: CreateFolderDto, @User() user: UserSession) {
        return this.folderService.createFolder(body, user);
    }

    @ApiOkResponse({ type: GetFolderResponse })
    @Get()
    async getFolders(@User() user: UserSession) {
        return this.folderService.getFolders(user);
    }
    
    @ApiOkResponse({ type: FolderResponse })
    @UseGuards(FolderOwnershipGuard)
    @Get(':folderId')
    async getFolderById(@Param('folderId') folderId: string) {
        return this.folderService.getFolderById(folderId);
    }

    @ApiOkResponse({ type: UpdateFolderResponse })
    @UseGuards(FolderOwnershipGuard)
    @Patch(':folderId')
    async updateFolderById(@Param('folderId') folderId: string, @Body() body: UpdateFolderDto) {
        return this.folderService.updateFolderById(folderId, body);
    }

    @ApiNoContentResponse({ description: 'folder successfully deleted!' })
    @UseGuards(FolderOwnershipGuard)
    @Delete(':folderId')
    async deleteFolderById(@Param('folderId') folderId: string) {
        return this.folderService.deleteFolderById(folderId);
    }
}

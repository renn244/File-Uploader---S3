import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { UserSession } from 'src/common/decorators/userSession.decorator';
import { Repository } from 'typeorm';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { Folder } from './folder.entity';

@Injectable()
export class FolderService {
    constructor(
        @Inject('FOLDER_REPOSITORY') private readonly folderRepository: Repository<Folder>, 
        @Inject('USER_REPOSITORY') private readonly userRepository: Repository<User>,
    ) {}

    async createFolder(body: CreateFolderDto, user: UserSession) {
        const user_acc = await this.userRepository.findOneBy({ clerkId: user.userId })

        if(!user_acc) throw new UnauthorizedException();

        const newFolder = this.folderRepository.create({ name: body.name, user: { id: user_acc?.id} })
        await this.folderRepository.save(newFolder);

        return newFolder;
    }

    async getFolders(user: UserSession) {
        const user_acc = await this.userRepository.findOneBy({ clerkId: user.userId })

        if(!user_acc) throw new UnauthorizedException();

        const folders = await this.folderRepository.find({
            relations: { user: true },
            where: { user: { id: user_acc.id } },
        });

        return folders
    }

    async getFolderById(folderId: string) {
        const folder = await this.folderRepository.findOneBy(
            { id: folderId }
        )

        if(!folder) {
            throw new NotFoundException('folder not found!')
        }

        return folder
    }

    async updateFolderById(folderId: string, body: UpdateFolderDto) {
        const updatedFolder = await this.folderRepository.update(
            { id: folderId },
            { name: body.name }
        )

        if(updatedFolder.affected === 0) {
            throw new NotFoundException('folder not found!')
        }

        return this.getFolderById(folderId);
    }

    async deleteFolderById(folderId: string) {
        const deletedFolder = await this.folderRepository.delete(
            { id: folderId }
        ) 
        
        if(deletedFolder.affected === 0) {
            throw new NotFoundException('folder not found!')
        }

        return {
            message: 'folder successfully deleted!'
        }
    }

    async getFolderUser(folderId: string) {
        const folderWithUser = await this.folderRepository.findOne({
            where: { id: folderId },
            relations: { user: true }
        })

        return folderWithUser
    }
}

import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { FolderService } from "../folder.service";

@Injectable()
export class FolderOwnershipGuard implements CanActivate {
    constructor(
        private readonly folderService: FolderService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        
        const userId = request['user'].sub;
        const folderId = request['params'].folderId;

        const folder = await this.folderService.getFolderUser(folderId);

        if(!folder) {
            throw new NotFoundException("Folder Not Found!")
        }

        if(folder.user.clerkId !== userId) {
            throw new ForbiddenException()
        }

        return true
    }
}
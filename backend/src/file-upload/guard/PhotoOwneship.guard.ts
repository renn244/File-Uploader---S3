import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { FileUploadService } from "../file-upload.service";

@Injectable()
export class PhotoOwnershipGuard implements CanActivate {
    constructor(
        private readonly fileUploadService: FileUploadService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const userId = request.user.sub;
        const photoId = request['params'].photoId;

        const photoWithFolderAndUserId = await this.fileUploadService.getPhotoWithFolderAndUserId(photoId);
    
        if(!photoWithFolderAndUserId) {
            throw new NotFoundException("Photo Not Found!")
        }

        if(photoWithFolderAndUserId.folder.user.clerkId !== userId) {
            throw new ForbiddenException();
        }

        return true
    }
}
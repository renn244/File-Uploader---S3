import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { FolderController } from './folder.controller';
import { FolderProvider } from './folder.provider';
import { FolderService } from './folder.service';
import { FolderOwnershipGuard } from './guard/folderOwnership.guard';

@Module({
    controllers: [FolderController],
    providers: [FolderService, FolderProvider, FolderOwnershipGuard],
    imports: [DatabaseModule, AuthModule],
    exports: [FolderService, FolderOwnershipGuard]
})
export class FolderModule {}

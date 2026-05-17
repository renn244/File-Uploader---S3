import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { FolderModule } from 'src/folder/folder.module';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { PhotoProvider } from './photo.provider';
import { S3Service } from './s3.service';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService, S3Service, PhotoProvider],
  imports: [DatabaseModule, FolderModule]
})
export class FileUploadModule {}

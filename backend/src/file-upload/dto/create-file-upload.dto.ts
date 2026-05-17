import { IsNotEmpty, IsString } from "class-validator";

export class CreateFileUploadDto {
    @IsNotEmpty({ message: 'folder must not be empty!' })
    @IsString()
    folderId!: string
}
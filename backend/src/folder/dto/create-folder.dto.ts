import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFolderDto {
    @IsNotEmpty({ message: 'name must not be empty!' })
    @IsString()
    @MinLength(5, { message: 'name must not be less than 10 letters' })
    @MaxLength(50, { message: 'name must not be more than 50 letters' })
    name!: string;
}
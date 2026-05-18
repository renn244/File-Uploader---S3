import { ApiResponseProperty } from "@nestjs/swagger";

export class FolderResponse {
    @ApiResponseProperty({ type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' })
    id!: string;
    
    @ApiResponseProperty({ type: 'string', example: 'personal' })
    name!: string;
    
    @ApiResponseProperty({ type: String, format: 'date-time', example: '2026-05-18T18:08:00+08:00' })
    createdAt!: Date;

    @ApiResponseProperty({ type: String, format: 'date-time', example: '2026-05-18T18:08:00+08:00' })
    updatedAt!: Date;
}
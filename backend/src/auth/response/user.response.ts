import { ApiResponseProperty } from "@nestjs/swagger";

export class UserResponse {
    @ApiResponseProperty({ type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' })
    id!: string;

    @ApiResponseProperty({ type: 'string', example: '123e4567-e89b-12d3-a456-262145752000' })
    clerkId!: string;

    @ApiResponseProperty({ type: 'string', example: 'renato' })
    name!: string;

    @ApiResponseProperty({ type: 'string', example: 'renn244' })
    username?: string;

    @ApiResponseProperty({ type: 'string', example: 'http://localhost:3000/image/avatar.png' })
    profileImageUrl!: string;

    @ApiResponseProperty({ type: 'string', format: 'date-time', example: '2026-05-18T18:08:00+08:00' })
    createdAt!: Date;

    @ApiResponseProperty({ type: 'string', format: 'date-time', example: '2026-05-18T18:08:00+08:00' })
    updatedAt!: Date;
}
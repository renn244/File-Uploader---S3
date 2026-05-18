import { User } from "src/auth/user.entity";
import { FolderResponse } from "./folder.response";
import { ApiResponseProperty } from "@nestjs/swagger";
import { UserResponse } from "src/auth/response/user.response";

export class GetFolderResponse extends FolderResponse {
    @ApiResponseProperty({ type: UserResponse })
    user!: User;
}
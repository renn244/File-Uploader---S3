import { ApiResponseProperty } from "@nestjs/swagger";
import { FolderResponse } from "src/folder/response/folder.response";
import { Photo } from "../photo.entity";
import { PhotoResponse } from "./photo.response";

export class GetPhotosResponse extends FolderResponse {
    
    @ApiResponseProperty({ type: [PhotoResponse] })
    photos!: Photo[]
}
import { Provider } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Photo } from "./photo.entity";

export const PhotoProvider: Provider = {
    provide: 'PHOTO_REPOSITORY',
    useFactory: (dataSource:  DataSource) => dataSource.getRepository(Photo),
    inject: ['DATA_SOURCE']
}
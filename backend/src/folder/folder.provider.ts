import { Provider } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Folder } from "./folder.entity";

export const FolderProvider: Provider = {
    provide: 'FOLDER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Folder),
    inject: ['DATA_SOURCE']
}
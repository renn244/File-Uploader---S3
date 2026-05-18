import { ApiResponse, ApiResponseProperty } from "@nestjs/swagger";
import { Folder } from "src/folder/folder.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Folder, (folder) => folder.photos, {
        onDelete: 'CASCADE'
    })
    folder!: Folder;
 
    @Column({ type: 'varchar', length: 255 })
    fileName!: string;

    @Column({ type: 'varchar', length: 255 })
    originalName!: string;

    @Column({ type: 'int' })
    fileSize!: number;

    @Column({ type: 'varchar', length: 100 })
    fileType!: string;

    @Column({ type: 'varchar', length: 100 })
    s3Bucket!: string;

    @Column({ type: 'text' })
    s3Key!: string;

    @CreateDateColumn({ type: 'timestamptz' })
    uploadedAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}
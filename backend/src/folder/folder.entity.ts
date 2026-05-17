import { User } from 'src/auth/user.entity';
import { Photo } from 'src/file-upload/photo.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Folder {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToMany(() => Photo, (photo) => photo.folder)
    photos!: Photo[];

    @Column({ type: 'varchar', length: 50 })
    name!: string;

    @ManyToOne(() => User , (user) => user.folders, {
        onDelete: 'CASCADE'
    })
    user!: User;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}
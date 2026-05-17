import { Folder } from 'src/folder/folder.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true })
    clerkId!: string;

    @Column()
    name!: string

    @Column({ type: 'varchar', length: 100, nullable: true })
    username!: string | null;

    @Column()
    profileImageUrl!: string;

    @OneToMany(() => Folder, (folder) => folder.user)
    folders!: Folder[];

    @Column({ type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}
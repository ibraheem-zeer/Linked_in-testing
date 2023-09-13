import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { OneToMany } from 'typeorm/browser';
import { User } from './User.js';
import { Permission } from './permission.js';


@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Permission, { cascade: true, eager: true })
    @JoinTable()
    permissions: Permission[];

    @OneToMany(() => User, user => user.role)
    users: User
}
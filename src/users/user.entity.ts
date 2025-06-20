import { Exclude } from 'class-transformer';
import { Role } from '../auth/enums/role.enum';
import { CarList } from '../car-listing/car-listing.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  userName: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  profileImage?: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  password?: string;

  @Exclude()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  googleId?: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Column({
    type: 'boolean',
    default: false,
  })
  isBlocked: boolean;

  @OneToMany(() => CarList, (carList) => carList.owner)
  carLists?: CarList[];

  @Column({ default: 0 })
  tokenVersion: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

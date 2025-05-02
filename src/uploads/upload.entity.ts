import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { fileTypes } from './enums/file-types.enum';

@Entity({ name: 'uploads' })
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column({ type: 'enum', enum: fileTypes, default: fileTypes.IMAGE })
  type: string;

  @Column()
  mime: string;

  @Column()
  size: number;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}

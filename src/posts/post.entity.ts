import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostType, StatusType } from './dtos/create-post.dto';
import { CreatePostMetaOptionsDto } from '../meta-options/dtos/create-post-meta-options.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.POST,
  })
  postType: PostType;

  @Column({ unique: true })
  slug: string;

  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.DRAFT,
  })
  status: StatusType;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  schema: string;

  @Column()
  featuredImageUrl: string;

  @Column()
  publishOn: Date;

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable()
  tags?: Tag[];

  // eager:true
  @OneToOne(() => MetaOption, (metaOptions) => metaOptions.post, {
    cascade: true,
  })
  metaOptions?: MetaOption;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;
}

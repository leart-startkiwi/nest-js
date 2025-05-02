import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { updateFields } from 'src/utils/helpers';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    /**
     * Injecting paginationProvider
     */
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    // Find author from database based un authorId
    const author = await this.usersService.findOneById(user.sub);

    if (!author) {
      throw new Error('Author not found');
    }

    const tags = await this.tagsService.findMultipleTags(
      createPostDto.tags || [],
    );

    const post = this.postsRepository.create({
      ...createPostDto,
      author,
      tags,
    });

    return await this.postsRepository.save(post);
  }

  public async findAll(
    postQuery: GetPostsDto,
    userId: number,
  ): Promise<Paginated<Post>> {
    return await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postsRepository,
      { relations: { metaOptions: true, author: true, tags: true } },
    );
  }

  public async delete(id: number) {
    // Find the post
    // const post = await this.postsRepository.findOne({
    //   where: { id },
    //   relations: { metaOptions: true },
    // });
    // // Delete the post
    await this.postsRepository.delete(id);
    // // Delete meta options
    // await this.metaOptionsRepository.delete(Number(post?.metaOptions?.id));

    return { deleted: true, id };

    // confirmation
  }

  public async update(patchPostDto: PatchPostDto) {
    // Find the Tags
    const tags = await this.tagsService.findMultipleTags(
      patchPostDto.tags || [],
    );

    if (!tags || tags.length !== patchPostDto.tags?.length) {
      throw new BadRequestException(
        'Please check your tag Ids and ensure they are correct',
      );
    }

    // Find the Post
    const post = await this.postsRepository.findOneBy({ id: patchPostDto.id });

    if (!post) {
      throw new NotFoundException('Post was not found');
    }
    const { id, ...otherProps } = patchPostDto;

    // Object.keys(otherProps).forEach((key) => {
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //   post[key] = otherProps[key];
    // });

    updateFields(post, otherProps);
    post.tags = tags;
    // // Update the properties
    // post.title = patchPostDto.title ?? post.title;
    // post.content = patchPostDto.content ?? post.content;
    // post.status = patchPostDto.status ?? post.status;
    // post.postType = patchPostDto.postType ?? post.postType;
    // post.slug = patchPostDto.slug ?? post.slug;
    // post.featuredImageUrl =
    //   patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    // post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    // // Assign the new tags
    // post.tags = tags;

    return await this.postsRepository.save(post);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>) {}

  async createPost(
    title: string,
    content: string,
    userId: string,
  ): Promise<Post> {
    try {
      const newPost = this.postRepo.create({ title, content, userId });
      return await this.postRepo.save(newPost);
    } catch (error) {
      throw new Error('Error creating post: ' + error.message);
    }
  }

  async getAllPosts(): Promise<Post[]> {
    return await this.postRepo.find();
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return await this.postRepo.find({ where: { userId } });
  }

  async getSinglePost(id: string): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return await post;
  }

  async updatePost(id: string, title: string, content: string): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.title = title;
    post.content = content;
    return await this.postRepo.save(post);
  }

  async deletePost(id: string): Promise<void> {
    const result = await this.postRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Post not found');
    }
  }
}

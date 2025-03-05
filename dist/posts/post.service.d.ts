import { Repository } from 'typeorm';
import { Post } from './post.entity';
export declare class PostService {
    private postRepo;
    constructor(postRepo: Repository<Post>);
    createPost(title: string, content: string, userId: string): Promise<Post>;
    getAllPosts(): Promise<Post[]>;
    getUserPosts(userId: string): Promise<Post[]>;
    updatePost(id: string, title: string, content: string): Promise<Post>;
    deletePost(id: string): Promise<void>;
}

import { PostService } from './post.service';
export declare class PostController {
    private postService;
    constructor(postService: PostService);
    getAllPosts(): Promise<import("./post.entity").Post[]>;
    getUserPosts(req: any): Promise<import("./post.entity").Post[]>;
    createPost(req: any, { title, content }: {
        title: any;
        content: any;
    }): Promise<import("./post.entity").Post>;
    updatePost(id: string, { title, content }: {
        title: any;
        content: any;
    }): Promise<import("./post.entity").Post>;
    deletePost(id: string): Promise<void>;
}

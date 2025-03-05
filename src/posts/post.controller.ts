import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getUserPosts(@Request() req) {
    return this.postService.getUserPosts(req.user.uid);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Request() req, @Body() { title, content }) {
    return this.postService.createPost(title, content, req.user.uid);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  getSinglePost(@Param('id') id: string) {
    return this.postService.getSinglePost(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updatePost(@Param('id') id: string, @Body() { title, content }) {
    return this.postService.updatePost(id, title, content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
}

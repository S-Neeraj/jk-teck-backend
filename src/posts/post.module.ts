import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './post.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), JwtModule.register({})],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}

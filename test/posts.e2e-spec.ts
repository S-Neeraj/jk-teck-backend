import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('Posts API (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let accessToken: string;
  let createdPostId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get JWT Token for authentication (Mock Firebase user)
    jwtService = moduleFixture.get<JwtService>(JwtService);
    accessToken = jwtService.sign({
      uid: 'test-user-id',
      email: 'test@example.com',
    });
  });

  it('should create a new post', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Test Post', content: 'This is a test content' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Post');
    expect(response.body.content).toBe('This is a test content');

    createdPostId = response.body.id;
  });

  it('should retrieve all posts', async () => {
    const response = await request(app.getHttpServer())
      .get('/posts')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should update a post', async () => {
    const response = await request(app.getHttpServer())
      .put(`/posts/${createdPostId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Updated Post', content: 'Updated content' })
      .expect(200);

    expect(response.body.affected).toBe(1);
  });

  it('should delete a post', async () => {
    await request(app.getHttpServer())
      .delete(`/posts/${createdPostId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});

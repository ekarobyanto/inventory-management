import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let token: string;
  const loginCredential = {
    email: 'your@email.com',
    password: '123456',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users - should return 401 when hit without bearer token', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('/auth/login - should 200 OK with correct user credential', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginCredential)
      .expect(HttpStatus.OK);
  });

  it('/auth/login - should return JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginCredential);
    expect(response.body.data).toHaveProperty('access_token');
    token = response.body.data.access_token;
    console.log(token);
  });

  it('/users - should return 200 OK when using bearer token', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore: esModuleInterop flag set in tsconfig.json
import request from 'supertest';
// @ts-ignore: esModuleInterop flag set in tsconfig.json
import app from '../src/app';

describe('GET /random-url', () => {
  it('should return 404', (done) => {
    request(app).get('/reset')
      .expect(200, done);
  });
});

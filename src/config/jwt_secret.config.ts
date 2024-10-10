import { registerAs } from '@nestjs/config';

export default registerAs('jwt_secret', () => ({
  key: process.env.JWT_SECRET,
}));

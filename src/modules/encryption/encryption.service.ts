import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  constructor() {}

  hashValue = async (value: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(value, salt);
  };

  compareValue = async (value: string, hash: string) => {
    return await bcrypt.compare(value, hash);
  };
}

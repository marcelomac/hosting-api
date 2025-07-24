import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  private readonly baseDirectory = './uploads';

  async getFile(filename: string, subfolder: string): Promise<Buffer> {
    const filePath = join(this.baseDirectory, subfolder, filename);
    return fs.readFile(filePath);
  }

  async deleteFile(filename: string, subfolder: string): Promise<void> {
    const filePath = join(this.baseDirectory, subfolder, filename);
    return fs.unlink(filePath);
  }
}

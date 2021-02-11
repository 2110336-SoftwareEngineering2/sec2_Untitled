import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetOwner } from './entities/petowner.entity';

@Injectable()
export class AppService {
  constructor(@InjectRepository(PetOwner) private readonly repo: Repository<PetOwner>) { }

  getHello(): string {
    return 'Hello World!';
  }

}

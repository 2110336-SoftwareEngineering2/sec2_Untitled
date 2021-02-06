import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetOwner } from './entities/petowner.entity';
import { PetSitter } from './entities/petsitter.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '54.169.16.254',
      port: 3306,
      username: 'se2',
      password: 'se2',
      database: 'se2',
      entities: [PetOwner, PetSitter],
      synchronize: true // this should be false in production
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

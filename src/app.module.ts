import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetOwner } from './entities/petowner.entity';
import { PetSitter } from './entities/petsitter.entity';
import { AccountModule } from './account/account.module';
import { ReviewModule } from './review/review.module';
import { BookingModule } from './booking/booking.module';
import { SearchModule } from './search/search.module';
import { Pet } from './entities/pet.entity';
import { Booking } from './entities/booking.entity';
import { SitterReview } from './entities/sitterreview.entity';
import { OwnerReview } from './entities/ownerreview.entity';
import { AuthModule } from './auth/auth.module';
  import { AuthMiddleware } from './middleware/auth.middleware';
import { SitterAnimal } from './entities/sitteranimal.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '54.169.16.254',
      port: 3306,
      username: 'se2',
      password: 'se2',
      database: 'se2',
      entities: [PetOwner, PetSitter, Pet, Booking, OwnerReview, SitterReview, SitterAnimal] ,
      synchronize: true // this should be false in production
    }),TypeOrmModule.forFeature([PetOwner]), 
    AccountModule, ReviewModule, BookingModule, SearchModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}

// export class AppModule implements NestModule{
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthMiddleware).forRoutes('/secret');
//   }
// }

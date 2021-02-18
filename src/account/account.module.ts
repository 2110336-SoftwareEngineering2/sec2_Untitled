import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/auth/constants';
// import { AppModule } from 'src/app.module';
// import { AuthModule } from 'src/auth/auth.module';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports : [TypeOrmModule.forFeature([PetOwner]),TypeOrmModule.forFeature([PetSitter]), JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: {expiresIn: '1d'}
  }) ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService]
})

// export class AccountModule{}

export class AccountModule {}
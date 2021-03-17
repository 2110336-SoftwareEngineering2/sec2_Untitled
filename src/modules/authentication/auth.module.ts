import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from 'src/modules/account/account.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    AccountModule,
    PassportModule,
    NotificationModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '1d'}
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
